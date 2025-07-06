"use client";
import React, { useState } from "react";
import { InputSection } from "./components/InputSection.tsx/InputSection";
import { AnswerDisplay } from "./components/AnswerDisplay/AnswerDisplay";

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

export default function Page() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query: question, characters }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    await handleConfirm(data.results);
  }

  async function handleConfirm(selected: any[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ question, characters }),
      headers: { "Content-Type": "application/json" },
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    setAnswer("");

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      for (const line of chunk.split("\n")) {
        if (line.startsWith("data: ")) {
          const json = line.replace("data: ", "").trim();
          if (json && json !== "[DONE]") {
            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                setAnswer((prev) => prev + content);
              }
            } catch (e) {
              console.error("Failed to parse chunk:", json);
            }
          }
        }
      }
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 24 }}>
      {!loading && !answer && (
        <InputSection
          characters={characters ?? []}
          question={question}
          setQuestion={setQuestion}
          onSearch={handleSearch}
          disabled={loading}
        />
      )}
      {loading && <p>Generating Scenario. It takes awhile!!!</p>}
      {!loading && answer && <AnswerDisplay content={answer} />}
    </main>
  );
}
