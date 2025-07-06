"use client";
import React from "react";
import ReactMarkdown from "react-markdown";

export function AnswerDisplay({ content }: { content: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
