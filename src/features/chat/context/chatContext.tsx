"use client";

import React, { createContext, useContext } from "react";
import type { ChatSummaryDto } from "@/features/chat/types/chatApi";

export type ChatsContextValue = {
  chats: ChatSummaryDto[];
  isChatsLoading: boolean;
  loadChats: () => Promise<void>;

  goToChat: (id: string) => Promise<void>;
  newChat: () => Promise<any>;
  renameChat: (id: string, title: string) => Promise<void>;
  createChatFromFirstMessage: (firstMessageText: string) => Promise<any>;
};

const ChatsContext = createContext<ChatsContextValue | null>(null);

export function ChatsProvider({
  value,
  children,
}: {
  value: ChatsContextValue;
  children: React.ReactNode;
}) {
  return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>;
}

export function useChats() {
  const ctx = useContext(ChatsContext);
  if (!ctx) throw new Error("useChats must be used inside <ChatsProvider>");
  return ctx;
}
