"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useSearchParams } from "next/navigation";

type UiMessage = {
  id?: string;
  content: string;
  created_at: string;
  sender: string;
};
type GameRow = {
  id: string;
  code: string | null;
  story: { title: string | null; blurb: string | null } | null; // FK to stories
};

export function useChatGame(
  currentUser: { name: string; sunSign?: string; avatarUrl?: string },
  characters: {
    name: string;
    sunSign: string;
    avatarUrl?: string;
    motivation: string;
  }[]
) {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") ?? "";

  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [introBlurb, setIntroBlurb] = useState<string | null>(null);
  const [hasMessages, setHasMessages] = useState<boolean>(false);

  const sortChron = (a: UiMessage, b: UiMessage) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

  const onPlayerInsert = (payload: any) => {
    const r = payload.new;
    setMessages((prev) =>
      [
        ...prev,
        {
          id: r.id,
          content: r.content,
          created_at: r.created_at,
          sender: r.user_id,
        },
      ].sort(sortChron)
    );
    setHasMessages(true);
  };

  const onSystemInsert = (payload: any) => {
    const s = payload.new;
    setMessages((prev) =>
      [
        ...prev,
        {
          id: s.id,
          content: s.content,
          created_at: s.created_at,
          sender: "Scenario",
        },
      ].sort(sortChron)
    );
    setHasMessages(true);
  };

  // Start = seed the intro blurb exactly once if the room is empty
  const handleStart = useCallback(
    async (blurb: string) => {
      if (!gameId || !blurb) return;
      // re-check to avoid races
      const [p, s] = await Promise.all([
        supabase
          .from("player_responses")
          .select("id", { head: true, count: "exact" })
          .eq("room", gameId)
          .limit(1),
        supabase
          .from("system_responses")
          .select("id", { head: true, count: "exact" })
          .eq("room", gameId)
          .limit(1),
      ]);
      const roomEmpty = (p.count ?? 0) === 0 && (s.count ?? 0) === 0;
      if (!roomEmpty) return;

      const { error } = await supabase
        .from("system_responses")
        .insert([{ room: gameId, content: blurb }]);
      if (error) {
        console.error("seed intro error", error);
        return;
      }
      setHasMessages(true);
      setIntroBlurb(null);
    },
    [gameId]
  );

  useEffect(() => {
    if (!gameId) return;
    let mounted = true;

    (async () => {
      // 1) Load game + story blurb
      const { data: game, error: gErr } = await supabase
        .from("games")
        .select(`id, code, story:stories ( title, blurb )`)
        .eq("id", gameId)
        .single<GameRow>();

      if (!mounted) return;
      if (gErr) {
        console.error("load game error", gErr);
      }

      // 2) Check if any messages already exist
      const [pHead, sHead] = await Promise.all([
        supabase
          .from("player_responses")
          .select("id", { head: true, count: "exact" })
          .eq("room", gameId)
          .limit(1),
        supabase
          .from("system_responses")
          .select("id", { head: true, count: "exact" })
          .eq("room", gameId)
          .limit(1),
      ]);
      if (!mounted) return;

      const anyMsgs = (pHead.count ?? 0) > 0 || (sHead.count ?? 0) > 0;
      setHasMessages(anyMsgs);

      // Only surface blurb pre-chat if no messages exist
      const blurb = !anyMsgs ? game?.story?.blurb ?? null : null;
      setIntroBlurb(blurb);

      // 3) If empty AND we have a blurb, start the game by seeding it
      if (!anyMsgs && blurb) {
        setLoading(true);
        await handleStart(blurb);
        setLoading(false);
      }

      // 4) Load history
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
      if (!mounted) return;

      const all: UiMessage[] = [
        ...(players.data ?? []).map((r) => ({
          id: r.id,
          content: r.content,
          created_at: r.created_at,
          sender: r.user_id,
        })),
        ...(systems.data ?? []).map((s) => ({
          id: s.id,
          content: s.content,
          created_at: s.created_at,
          sender: "Scenario",
        })),
      ].sort(sortChron);
      setMessages(all);

      // 5) Realtime subscription (room-scoped)
      const channel = supabase
        .channel(`room:${gameId}`, { config: { broadcast: { ack: true } } })
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "player_responses",
            filter: `room=eq.${gameId}`,
          },
          onPlayerInsert
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "system_responses",
            filter: `room=eq.${gameId}`,
          },
          onSystemInsert
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    })();

    return () => {
      mounted = false;
    };
  }, [gameId, handleStart]);

  const handleSend = useCallback(
    async (message: string | { message: string }) => {
      if (!gameId) return;

      const text = typeof message === "string" ? message : message?.message;
      if (!text?.trim()) return;

      await supabase
        .from("player_responses")
        .insert([{ room: gameId, user_id: currentUser.name, content: text }]);

      setLoading(true);
      try {
        await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-transform",
          },
          body: JSON.stringify({
            gameId,
            characters,
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

  return {
    messages,
    loading,
    hasMessages,
    introBlurb, // will be null after seeding or if messages already exist
    handleStart,
    handleSend,
    gameId,
  };
}
