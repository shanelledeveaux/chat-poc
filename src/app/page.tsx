"use client";
import React, { useState } from "react";

export default function Page() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query: question }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    await handleConfirm(data.results);
  }

  async function handleConfirm(selected: any[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ question, sources: selected }),
      headers: { "Content-Type": "application/json" },
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

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
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="A few keywords for your scenario"
        style={{ width: "80%" }}
      />
      <button onClick={handleSearch} disabled={loading}>
        Search
      </button>

      <pre>{answer}</pre>
    </main>
  );
}
