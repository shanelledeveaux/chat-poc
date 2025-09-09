"use client";
import React, { Suspense, useCallback } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { CharacterList } from "../components/CharacterList/CharacterList";
import { useChatGame } from "../hooks/useChatGame/useChatGame";
import { ChatPanel } from "../components/ChatPanel/ChatPanel";
import { useSearchParams } from "next/navigation";

const characters: {
  name: string;
  sunSign: string;
  avatarUrl: string;
  motivation: string;
}[] = [
  {
    name: "Brian",
    sunSign: "Cancer",
    avatarUrl: "user-avatar.jpg",
    motivation: "personal",
  },
  {
    name: "Veronica",
    sunSign: "Capricorn",
    avatarUrl: "user-avatar.jpg",
    motivation: "investigative",
  },
  {
    name: "Alex",
    sunSign: "Cancer",
    avatarUrl: "user-avatar.jpg",
    motivation: "accidental",
  },
  {
    name: "Juan",
    sunSign: "Sagittarius",
    avatarUrl: "user-avatar.jpg",
    motivation: "personal",
  },
];
type PlayerCharacter = {
  name: string;
  sunSign: string;
  avatarUrl: string;
  motivation: string;
};

const currentUser: PlayerCharacter = {
  name: "Brian",
  sunSign: "Cancer",
  avatarUrl: "user-avatar.jpg",
  motivation: "personal",
};
function ChatGameInner() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") ?? "";

  const { handleSend, handleStart, messages, loading } = useChatGame(
    currentUser,
    [...characters],
    gameId
  );

  const onSend = useCallback(
    async (msg: string | { message: string }) => {
      if (!gameId) {
        await handleStart("Chat to start a new game!");
      }
      await handleSend(typeof msg === "string" ? msg : msg.message);
    },
    [gameId, handleStart, handleSend]
  );

  return (
    <main>
      <CharacterList characters={[...characters]} />
      <ChatPanel
        currentUser={currentUser}
        messages={messages}
        loading={loading}
        onSend={onSend}
      />
    </main>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatGameInner />
    </Suspense>
  );
}
