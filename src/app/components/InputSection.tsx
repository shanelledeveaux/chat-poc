"use client";
import React from "react";

interface PlayerCharacter {
  name: string;
  sunSign: string;
  avatarUrl?: string;
}

interface Props {
  characters: PlayerCharacter[];
  question: string;
  setQuestion: (val: string) => void;
  onSearch: () => void;
  disabled: boolean;
}

export function InputSection({
  characters,
  question,
  setQuestion,
  onSearch,
  disabled,
}: Props) {
  console.log(characters);
  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex flex-wrap gap-4">
        {(characters ?? []).map((user) => (
          <div key={user.name} className="flex items-center gap-2">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                ☀ {user.sunSign}
              </div>
            </div>
          </div>
        ))}
      </div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="A few keywords for your scenario"
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={onSearch}
        disabled={disabled}
        className="px-4 py-2 bg-brand text-white rounded"
      >
        Search
      </button>
    </div>
  );
}
