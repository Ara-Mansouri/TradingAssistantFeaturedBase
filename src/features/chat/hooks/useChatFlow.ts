"use client";

import { useEffect, useState } from "react";
import type { ChatSummaryDto } from "@/features/chat/types/chatApi";
import { chatService } from "@/features/chat/services/ChatService";
import { useConversation } from "@/features/conversation/context/useConversation";

function suggestTitleFromText(text: string) {
  const t = text.trim();
  if (!t) return "Chat";
  return t.length > 40 ? t.slice(0, 40) + "…" : t;
}
export type ChatFlow = ReturnType<typeof useChatFlow>;

export function useChatFlow() {
  const { setDisplayConversations, clearDisplayConversations } = useConversation();

  const [chats, setChats] = useState<ChatSummaryDto[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [isChatsLoading, setIsChatsLoading] = useState(false);
  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadChats = async () => {
    setIsChatsLoading(true);
    try {
      const data = await chatService.getMyChats();
      setChats(data.chats ?? []);
    } finally {
      setIsChatsLoading(false);
    }
  };

  const loadConversations = async (chatId: string) => {
    setIsConversationsLoading(true);
    try {
      const data = await chatService.getConversations(chatId);
      setDisplayConversations(data.conversations ?? []);
    } finally {
      setIsConversationsLoading(false);
    }
  };

  const selectChat = async (chatId: string) => {
    setSelectedChatId(chatId);
    await loadConversations(chatId);
  };

  const newChat = async (title: string) => {
    const created = await chatService.createChat(title);
    await loadChats();
    setSelectedChatId(created.chatId);
    clearDisplayConversations();
    return created.chatId;
  };

  const renameChat = async (chatId: string, title: string) => {
    const t = title.trim();
    if (!t) return;
    await chatService.renameChat(chatId, t);
    await loadChats();
  };

  const sendText = async (text: string) => {
    const t = text.trim();
    if (!t) return;

    setIsSending(true);
    try {
      let chatId = selectedChatId;
      const firstMessage = !chatId;

      if (!chatId) {

        chatId = await newChat(suggestTitleFromText(t));
      }

      await chatService.sendMessage(chatId, t);

      await loadConversations(chatId);

      
      if (firstMessage) {

      }
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    loadChats().catch(() => {});
  }, []);

  return {

    chats,
    selectedChatId,
    isChatsLoading,
    isConversationsLoading,
    isSending,


    loadChats,
    selectChat,
    newChat,
    renameChat,
    sendText,
  };
  
}
