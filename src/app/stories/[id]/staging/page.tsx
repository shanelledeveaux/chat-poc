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

  // Fake story for now
  const story = { title: "Name of story" };

  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function generateCode(length = 6) {
      const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
      let result = "";
      const randomValues = new Uint32Array(length);
      crypto.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
      }
      return result;
    }
    setGameCode(generateCode(6));
  }, []);

  const players = [
    { id: 1, name: "Player 1", avatar: "/user-avatar.jpg" },
    { id: 2, name: "Player 2", avatar: "/user-avatar.jpg" },
    { id: 3, name: "Player 3", avatar: "/user-avatar.jpg" },
  ];

  async function handleStart() {
    try {
      setLoading(true);

      // Generate a fresh gameId on click (don’t do this during render)
      const gameId = crypto.randomUUID();

      // Insert into Supabase (adjust columns to match your schema)
      const { error } = await supabase
        .from("games")
        .insert([{ id: gameId, title: story.title, code: gameCode }]);

      if (error) {
        console.error("Error creating game:", error);
        alert("Could not create game. Check console for details.");
        setLoading(false);
        return;
      }

      // Hard redirect so you don’t depend on router
      window.location.assign(
        `/chat?story=${encodeURIComponent(
          story.title
        )}&code=${gameCode}&gameId=${gameId}`
      );
    } catch (e) {
      console.error(e);
      alert("Something went wrong starting the game.");
      setLoading(false);
    }
  }

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
