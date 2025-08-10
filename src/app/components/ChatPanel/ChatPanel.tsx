"use client";
import React from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "./chatTheme.css";

export type ChatMessage = {
  content: string;
  created_at: string;
  sender: string;
};

type Props = {
  currentUser: { name: string };
  messages: ChatMessage[];
  loading?: boolean;
  onSend: (message: string | { message: string }) => void | Promise<void>;
};

export function ChatPanel({ currentUser, messages, loading, onSend }: Props) {
  return (
    <div className="chat-card rounded-md border border-gray-200 bg-white max-w-sm mx-auto h-[calc(100dvh-180px)]">
      <MainContainer>
        <ChatContainer>
          <MessageList autoScrollToBottom>
            {messages.map((m, i) => (
              <Message
                key={i}
                model={{
                  message: m.content,
                  sender: m.sender,
                  direction:
                    m.sender === currentUser.name ? "outgoing" : "incoming",
                  position: "single", // Adjust based on your message grouping logic
                }}
              />
            ))}
          </MessageList>

          <MessageInput
            placeholder={loading ? "Generating..." : "Type your response..."}
            onSend={onSend}
            disabled={!!loading}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
