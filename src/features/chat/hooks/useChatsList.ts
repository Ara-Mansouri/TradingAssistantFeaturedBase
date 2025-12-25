"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChatSummaryDto } from "@/features/chat/types/chatApi";
import { chatService } from "@/features/chat/services/ChatService";

function suggestTitleFromText(text: string) {
  const t = text.trim();
  if (!t) return "Chat";
  return t.length > 40 ? t.slice(0, 40) + "…" : t;
}

export function useChatsList() {
  const router = useRouter();

  const [chats, setChats] = useState<ChatSummaryDto[]>([]);
  const [isChatsLoading, setIsChatsLoading] = useState(false);//

  const loadChats = async () => {
    setIsChatsLoading(true);
    try {
      const data = await chatService.getMyChats();
      setChats(data.chats ?? []);
    } finally {
      setIsChatsLoading(false);
    }
  };

  const goToChat = async (id: string) => {
    router.push(`/c/${id}`);
  };

  const createChat = async (title: string) => {
    const created = await chatService.createChat(title);
    await loadChats(); 
    router.push(`/c/${created.chatId}`);
    return created;
  };

  const newChat = async () => {
    return createChat("Chat");
  };

  const createChatFromFirstMessage = async (firstMessageText: string) => {
    return createChat(suggestTitleFromText(firstMessageText));
  };

  const renameChat = async (id: string, title: string) => {
    const t = title.trim();
    if (!t) return;
    await chatService.renameChat(id, t);
    await loadChats(); 
  };

  useEffect(() => {
    loadChats().catch(() => {});
  }, []);

  return {
    chats,
    isChatsLoading,
    loadChats,
    goToChat,
    newChat,
    renameChat,
    createChatFromFirstMessage,
  };
}
