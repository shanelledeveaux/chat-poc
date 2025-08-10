"use client";
import { useState } from "react";

export function ResponseInput({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) {
  const [input, setInput] = useState("");

  function handleSubmit() {
    if (!input.trim()) return;
    onSubmit(input);
    setInput("");
  }

  return (
    <div className="mt-6 flex flex-col gap-2">
      <textarea
        placeholder="Describe what you'd do next..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
      <button
        onClick={handleSubmit}
        className="self-start bg-brand text-white px-4 py-2 rounded"
      >
        Submit Response
      </button>
    </div>
  );
}
