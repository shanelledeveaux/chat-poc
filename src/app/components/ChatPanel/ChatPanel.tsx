import React from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

interface Message {
  content: string;
  sender: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSend: (message: string) => void;
  loading: boolean;
  currentUser: { name: string };
}

export function ChatPanel({
  messages,
  onSend,
  loading,
  currentUser,
}: ChatPanelProps) {
  return (
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
          onSend={onSend}
          disabled={loading}
          attachButton={false}
        />
      </ChatContainer>
    </MainContainer>
  );
}
