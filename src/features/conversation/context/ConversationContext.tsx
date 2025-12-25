"use client";

import { createContext, useMemo, useState } from "react";
import type { ConversationDto } from "@/features/chat/types/chatApi";

export interface ConversationContextValue {
  displayConversations: ConversationDto[];
  setDisplayConversations: (items: ConversationDto[]) => void;
  clearDisplayConversations: () => void;
  appendConversation: (item: ConversationDto) => void;
}

export const ConversationContext = createContext<ConversationContextValue | null>(null);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [displayConversations, setDisplayConversationsState] = useState<ConversationDto[]>([]);

  const setDisplayConversations = (items: ConversationDto[]) => setDisplayConversationsState(items);
  const clearDisplayConversations = () => setDisplayConversationsState([]);
  const appendConversation = (item: ConversationDto) =>
    setDisplayConversationsState((prev) => [...prev, item]);
  const value = useMemo(
    () => ({ displayConversations, setDisplayConversations, clearDisplayConversations ,appendConversation }),
    [displayConversations]
  );

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
}
