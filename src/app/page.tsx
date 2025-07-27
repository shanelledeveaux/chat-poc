"use client";
import React, { useEffect, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import { supabase } from "./lib/supabaseClient";
import { CharacterList } from "./components/CharacterList/CharacterList";

interface PlayerCharacter {
  name: string;
  sunSign: string;
  avatarUrl?: string;
}
const characters: PlayerCharacter[] = [
  { name: "Brian", sunSign: "Cancer", avatarUrl: "user-avatar.jpg" },
  { name: "Veronica", sunSign: "Capricorn", avatarUrl: "user-avatar.jpg" },
  { name: "Alex", sunSign: "Cancer", avatarUrl: "user-avatar.jpg" },
  { name: "Juan", sunSign: "Sagittarius", avatarUrl: "user-avatar.jpg" },
];

const currentUser: PlayerCharacter = {
  name: "Brian",
  sunSign: "Cancer",
  avatarUrl: "user-avatar.jpg",
};

export default function Page() {
  const [messages, setMessages] = useState<
    { content: string; created_at: string; sender: string }[]
  >([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameId] = useState(() => crypto.randomUUID());

  useEffect(() => {
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

      const allMessages = [
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
      ];

      allMessages.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      setMessages(allMessages);
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
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ question, characters }),
      headers: { "Content-Type": "application/json" },
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      buffer += chunk;
      for (const line of buffer.split("\n")) {
        if (line.startsWith("data: ")) {
          const json = line.replace("data: ", "").trim();
          if (json && json !== "[DONE]") {
            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                const createdAt = new Date().toISOString();

                setMessages((prev) => [
                  ...prev,
                  {
                    content,
                    created_at: createdAt,
                    sender: "Scenario",
                  },
                ]);

                await supabase.from("scenario_steps").insert([
                  {
                    game_id: gameId,
                    ai_markdown: content,
                    created_at: createdAt,
                  },
                ]);
              }
            } catch (e) {
              console.error("Parse error:", json);
            }
          }
        }
      }
    }
    setLoading(false);
  };

  const handleSend = async (message: string | { message: string }) => {
    const text = typeof message === "string" ? message : message?.message;
    if (!text?.trim()) return;
    console.log(gameId);
    await supabase
      .from("player_responses")
      .insert([{ room: gameId, user_id: currentUser.name, content: text }]);

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

    const history = [
      ...(responses.data || []).map((r) => ({
        role: "user",
        content: `${r.user_id}: ${r.content}`,
        created_at: r.created_at,
      })),
      ...(steps.data || []).map((s) => ({
        role: "assistant",
        content: s.ai_markdown,
        created_at: s.created_at,
      })),
    ].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history, characters }),
    });
  };

  return (
    <main style={{ padding: 24 }}>
      <CharacterList characters={characters} />

      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((m, i) => (
              <Message
                key={i}
                model={{
                  message: m.content,
                  sender: m.sender,
                  direction:
                    m.sender === currentUser.name ? "outgoing" : "incoming",
                  position: "single",
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            placeholder={
              loading ? "Generating scenario..." : "Type your response..."
            }
            onSend={handleSend}
            disabled={loading}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>

      <div style={{ marginTop: 16 }}>
        <input
          type="text"
          placeholder="Scenario theme..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSearch} disabled={loading || !question}>
          Start Scenario
        </button>
      </div>
    </main>
  );
}
