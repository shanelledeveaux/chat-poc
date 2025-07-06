"use client";
import React from "react";

interface Props {
  question: string;
  setQuestion: (val: string) => void;
  onSearch: () => void;
  disabled: boolean;
}

export function InputSection({
  question,
  setQuestion,
  onSearch,
  disabled,
}: Props) {
  return (
    <>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="A few keywords for your scenario"
        style={{ width: "80%" }}
      />
      <button onClick={onSearch} disabled={disabled}>
        Search
      </button>
    </>
  );
}
