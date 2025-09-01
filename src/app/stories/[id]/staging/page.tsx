"use client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PrimaryButton } from "@/app/components/PrimaryButton/PrimaryButton";
import { supabase } from "@/app/lib/supabaseClient";

export default async function StoryStagingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: Fetch story data from DB
  const story = { title: "Name of story" };
  if (!story) return notFound();
  const gameId =  crypto.randomUUID()
  const code = "B54396"; // TODO: generate unique game code
  const players = [
    { id: 1, name: "Player 1", avatar: "/user-avatar.jpg" },
    { id: 2, name: "Player 2", avatar: "/user-avatar.jpg" },
    { id: 3, name: "Player 3", avatar: "/user-avatar.jpg" },
  ];

  async function handleStart() {
    // Insert into Supabase
    const { error } = await supabase
      .from("games")
      .insert([{ id: gameId, title: story.title, code }]);

    if (error) {
      console.error("Error creating game:", error);
      return;
    }

    // Navigate to chat page
      window.location.href = `/chat?story=${story.title}&code=${code}&gameId=${gameId}`;
  }

  return (
    <section className="max-w-sm mx-auto py-6 text-center">
      <header className="mb-6">
        <span className="block text-base font-semibold">LOGO</span>
      </header>

      <h1 className="text-2xl font-bold">{story.title}</h1>
      <p className="mt-2 text-sm text-gray-600">Share this code with friends</p>

      <div className="mt-3 flex items-center justify-center gap-3">
        <span className="rounded-md bg-gray-100 px-6 py-2 text-2xl font-bold tracking-widest">
          {code}
        </span>
        <button onClick={() => navigator.clipboard.writeText(code)}>📋</button>
        <button
          onClick={() => navigator.share?.({ text: `Join my game: ${code}` })}
        >
          🔗
        </button>
      </div>

      {/* Player slots */}
      <div className="mt-8 grid grid-cols-3 gap-4 justify-items-center">
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
        className="mt-8 block rounded-md bg-indigo-100 px-4 py-3 text-xs font-bold text-gray-900 hover:bg-indigo-200 active:bg-indigo-300"
      >
        START YOUR QUEST
      </PrimaryButton>
    </section>
  );
}
