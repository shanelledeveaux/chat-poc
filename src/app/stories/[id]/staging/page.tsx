"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/app/components/PrimaryButton/PrimaryButton";
import { supabase } from "@/app/lib/supabaseClient";

export default function StoryStagingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [story, setStory] = useState<any>(null);
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("id, title")
        .eq("id", id)
        .single();
      if (error) setErr(error.message);
      setStory(data);
    })();
  }, [id]);

  useEffect(() => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    const rnd = new Uint32Array(6);
    crypto.getRandomValues(rnd);
    setGameCode(Array.from(rnd, (n) => chars[n % chars.length]).join(""));
  }, []);

  const players = [
    { id: 1, name: "Player 1", avatar: "/user-avatar.jpg" },
    { id: 2, name: "Player 2", avatar: "/user-avatar.jpg" },
    { id: 3, name: "Player 3", avatar: "/user-avatar.jpg" },
  ];

  async function handleStart() {
    try {
      if (!story) return;
      setLoading(true);
      const gameId = crypto.randomUUID();

      const { error } = await supabase.from("games").insert([
        {
          id: gameId,
          story_id: story.id,
          title: story.title,
          code: gameCode,
        },
      ]);
      if (error) throw error;

      window.location.assign(
        `/chat?story=${encodeURIComponent(
          story.id ?? story.title
        )}&code=${gameCode}&gameId=${gameId}`
      );
    } catch (e) {
      console.error(e);
      alert("Could not create game.");
      setLoading(false);
    }
  }

  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (!story) return <p className="p-6">Loading…</p>;

  return (
    <section className="mx-auto py-6 text-center">
      <header className="mb-6">
        <span className="block text-base font-semibold">LOGO</span>
      </header>

      <h1 className="text-2xl font-bold">
        {story?.title ?? "Loading story..."}
      </h1>
      <p className="mt-2 text-sm text-gray-600">Share this code with friends</p>

      <div className="mt-3 flex items-center justify-center gap-3">
        <span className="rounded-md bg-gray-100 px-6 py-2 text-2xl font-bold tracking-widest">
          {gameCode || "••••••"}
        </span>
        <button
          onClick={() => gameCode && navigator.clipboard.writeText(gameCode)}
          disabled={!gameCode}
        >
          📋
        </button>
        <button
          onClick={() =>
            gameCode && navigator.share?.({ text: `Join my game: ${gameCode}` })
          }
          disabled={!gameCode}
        >
          🔗
        </button>
      </div>

      {/* Player slots */}
      <div className="max-w-md mt-8 grid grid-cols-3 gap-4 justify-items-center justify-self-center">
        {Array.from({ length: 6 }).map((_, idx) => {
          const player = players[idx];
          return player ? (
            <Image
              key={idx}
              src={player.avatar}
              alt={player.name}
              width={72}
              height={72}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              key={idx}
              className="h-[72px] w-[72px] rounded-full border-2 border-dashed border-gray-300"
            />
          );
        })}
      </div>

      {/* Start Button */}
      <PrimaryButton
        onClick={handleStart}
        className={`justify-self-center mt-8 block rounded-md bg-indigo-100 px-4 py-3 text-xs font-bold text-gray-900 hover:bg-indigo-200 active:bg-indigo-300 ${
          !gameCode || loading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {loading ? "Starting..." : "START YOUR QUEST"}
      </PrimaryButton>
    </section>
  );
}
