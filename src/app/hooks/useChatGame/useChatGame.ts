// hooks/useChatGame.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";

type UiMessage = { id?: string; content: string; created_at: string; sender: string };

export function useChatGame(
  currentUser: { name: string; sunSign?: string; avatarUrl?: string },
  characters: { name: string; sunSign: string; avatarUrl?: string; motivation: string }[]
) {
  // If you want a different default, lift this to the caller.
  const [gameId, setGameId] = useState<string>("9564f6c3-ed3a-4e06-a167-3ddc08989278");
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // ----- helpers -----
  function sortChron(a: UiMessage, b: UiMessage) {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  }

  function onPlayerInsert(payload: any) {
    const r = payload.new;
    setMessages(prev => [...prev, {
      id: r.id,
      content: r.content,          // keep content clean; render "Name: " in UI
      created_at: r.created_at,
      sender: r.user_id,
    }].sort(sortChron));
  }

  function onSystemInsert(payload: any) {
    const s = payload.new;
    setMessages(prev => [...prev, {
      id: s.id,
      content: s.content,
      created_at: s.created_at,
      sender: "Scenario",
    }].sort(sortChron));
  }

  // ----- load + subscribe -----
  useEffect(() => {
    if (!gameId) return;

    let isMounted = true;

    async function loadInitial() {
      const [players, systems] = await Promise.all([
        supabase
          .from("player_responses")
          .select("id, user_id, content, created_at")
          .eq("room", gameId),
        supabase
          .from("system_responses")
          .select("id, content, created_at")
          .eq("room", gameId),
      ]);

      if (!isMounted) return;

      const all: UiMessage[] = [
        ...(players.data ?? []).map(r => ({
          id: r.id,
          content: r.content,
          created_at: r.created_at,
          sender: r.user_id,
        })),
        ...(systems.data ?? []).map(s => ({
          id: s.id,
          content: s.content,
          created_at: s.created_at,
          sender: "Scenario",
        })),
      ].sort(sortChron);

      setMessages(all);
    }

    loadInitial();

    const channel = supabase.channel(`room:${gameId}`, {
      config: { broadcast: { ack: true } },
    });

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "player_responses",
          // filter: `room=${gameId}`,
        },
        onPlayerInsert
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "system_responses",
          // filter: `room=eq.${gameId}`,
        },
        onSystemInsert
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);

    };
  }, [gameId]);

  // ----- actions -----
  const handleStart = useCallback(async (_message?: { message: string }) => {
    // keep it simple for now (no new game creation flow)
    setGameId("9564f6c3-ed3a-4e06-a167-3ddc08989278");
  }, []);

  const handleSend = useCallback(
    async (message: string | { message: string }) => {
      if (!gameId) return;

      const text = typeof message === "string" ? message : message?.message;
      if (!text?.trim()) return;

      // 1) persist player message (Realtime will fan it out; no optimistic append to avoid duplicates)
      await supabase
        .from("player_responses")
        .insert([{ room: gameId, user_id: currentUser.name, content: text }]);

      // 2) trigger server to generate a system response (we ignore streaming here)
      setLoading(true);
      try {
        await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Cache-Control": "no-cache, no-transform" },
          body: JSON.stringify({
            gameId,
            characters,
            // align with your server route that expects new_response
            new_response: { user_id: currentUser.name, content: text },
          }),
        });
      } catch (e) {
        console.error("send error", e);
      } finally {
        setLoading(false);
      }
    },
    [gameId, currentUser.name, characters]
  );

  return { messages, loading, handleSend, handleStart, gameId };
}
