"use client";

import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import type { ConversationDto } from "@/features/chat/types/chatApi";

export default function MessageList({ items , isConversationsLoading }: { items: ConversationDto[] , isConversationsLoading : boolean }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items]);


 if (isConversationsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }
  if (items.length === 0 && !isConversationsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[750px] px-4">
          {items.map((x, idx) => (
            <ChatBubble key={`${x.registeredAt}-${x.side}-${idx}`} item={x} />
          ))}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
