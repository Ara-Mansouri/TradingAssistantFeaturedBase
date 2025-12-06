"use client";

import { useEffect, useRef } from "react";
import ChatBubble, { ChatMessage } from "./ChatBubble";

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 ">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <div className="w-full flex justify-center">
        <div className="w-full  max-w-[750px] px-4">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
      </div>
      </div>
      )}
    </div>
  );
}

