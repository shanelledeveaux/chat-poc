"use client";
import React from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { CharacterList } from "../components/CharacterList/CharacterList";
import { useChatGame } from "../hooks/useChatGame/useChatGame";
import { ChatPanel } from "../components/ChatPanel/ChatPanel";

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

export default function Page() {
  const { handleSend, handleStart, gameId, messages, loading } = useChatGame(
    currentUser,
    characters
  );

  const onSend = async (msg: string | { message: string }) => {
    // if no gameId yet, start a new one first
    if (!gameId) {
      handleStart();
    }
    await handleSend(typeof msg === "string" ? msg : msg.message);
  };

  return (
    <main>
      <CharacterList characters={characters} />
      <ChatPanel
        currentUser={currentUser}
        messages={messages}
        loading={loading}
        onSend={onSend}
      />
    </main>
  );
}
