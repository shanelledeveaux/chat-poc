import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";

export function useChatGame(
  currentUser: { name: any; sunSign?: string; avatarUrl?: string },
  characters: {
    name: string;
    sunSign: string;
    avatarUrl: string;
    motivation: string;
  }[]
) {
  const [messages, setMessages] = useState<
    { content: string; created_at: string; sender: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);

  const isStreamingRef = useRef(false);
  const streamingMsgIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!gameId) return;

    async function loadInitial() {
      const [responses, steps] = await Promise.all([
        supabase
          .from("player_responses")
          .select("user_id, content, created_at")
          .eq("room", gameId),
        supabase
          .from("scenario_steps")
          .select("ai_markdown, created_at")
          .eq("game_id", gameId),
      ]);

      const all = [
        ...(responses.data || []).map((r) => ({
          content: `${r.user_id}: ${r.content}`,
          created_at: r.created_at,
          sender: r.user_id,
        })),
        ...(steps.data || []).map((s) => ({
          content: s.ai_markdown,
          created_at: s.created_at,
          sender: "Scenario",
        })),
      ].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      setMessages(all);
    }

    loadInitial();

    const channel = supabase.channel("chat_room_live");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "player_responses" },
        (payload) => {
          const msg = payload.new;
          setMessages((prev) => [
            ...prev,
            {
              content: `${msg.user_id}: ${msg.content}`,
              created_at: msg.created_at,
              sender: msg.user_id,
            },
          ]);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "scenario_steps" },
        (payload) => {
          const step = payload.new;
          setMessages((prev) => [
            ...prev,
            {
              content: step.ai_markdown,
              created_at: step.created_at,
              sender: "Scenario",
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const handleStart = useCallback(
    async (message: { message: any }) => {
      // TEMPORARILY PLAYING THE SAME GAME
      // const newId = crypto.randomUUID();
      setGameId("d3483344-67b8-41c3-888f-c717d4316241");
      // setMessages([]);
      // supabase
      //   .from("games")
      //   .insert([{ id: newId, title: "test", code: "BBB124" }])
      //   .then(() => {
      //     setGameId(newId);
      //   });
    },
    [characters, supabase]
  );

  const handleSend = useCallback(
    async (message: string | { message: string }) => {
      if (!gameId) return;

      const text = typeof message === "string" ? message : message?.message;
      if (!text?.trim()) return;

      // 1) persist player message (others will see via Realtime)
      await supabase
        .from("player_responses")
        .insert([{ room: gameId, user_id: currentUser.name, content: text }]);

      // 2) call server to start AI stream
      setLoading(true);
      isStreamingRef.current = true;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameId,
            characters, // optional, but supported by your route
            message: `${currentUser.name}: ${text}`,
          }),
        });

        const reader = res.body?.getReader();
        if (!reader) {
          setLoading(false);
          isStreamingRef.current = false;
          return;
        }

        // 3) add a pending Scenario message we will grow with chunks
        const createdAt = new Date().toISOString();
        let idx = -1;
        setMessages((prev) => {
          const next = prev.slice();
          next.push({ content: "", created_at: createdAt, sender: "Scenario" });
          idx = next.length - 1;
          streamingMsgIndexRef.current = idx;
          return next;
        });

        const decoder = new TextDecoder();
        let buffer = "";

        const appendDelta = (delta: string) => {
          if (!delta) return;
          setMessages((prev) => {
            const next = prev.slice();
            const i = streamingMsgIndexRef.current ?? next.length - 1;
            if (!next[i]) return prev; // safety
            next[i] = {
              ...next[i],
              content: next[i].content + delta,
            };
            return next;
          });
        };

        // Supports either raw text chunks OR SSE "data: {json}" lines
        const extractContent = (chunk: string) => {
          // If SSE style, parse lines; otherwise treat as raw text
          let out = "";
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const payload = line.slice(6).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const parsed = JSON.parse(payload); // OpenAI SSE delta
                out += parsed?.choices?.[0]?.delta?.content ?? "";
              } catch {
                // not JSON; just append as text
                out += payload;
              }
            } else {
              // raw chunk or plain text line
              out += line;
              if (lines.length > 1) out += "\n";
            }
          }
          return out;
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer = decoder.decode(value, { stream: true });
          appendDelta(extractContent(buffer));
        }
      } catch (e) {
        console.error("stream error", e);
      } finally {
        setLoading(false);
        // Let Realtime deliver the final persisted row; avoid doubling.
        // Optional: mark streaming done so your system_responses listener
        // can ignore the very next insert if its content equals the streamed one.
        isStreamingRef.current = false;
        streamingMsgIndexRef.current = null;
      }
    },
    [gameId, currentUser.name] // include characters in deps if not stable
  );

  return { messages, loading, handleSend, handleStart, gameId };
}
