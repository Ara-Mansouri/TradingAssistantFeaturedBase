"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { chatService } from "@/features/chat/services/ChatService";
import { useConversation } from "@/features/conversation/context/useConversation";

export function useChatThread(opts: {
  chatId: string | null;
  onNeedCreateChat?: (firstMessageText: string) => Promise<{ chatId: string }>;
}) {
  const { chatId, onNeedCreateChat } = opts;

  const router = useRouter();
  const { setDisplayConversations, clearDisplayConversations , appendConversation } = useConversation();

  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadConversations = async (id: string) => {
    setIsConversationsLoading(true);
    try {
      const data = await chatService.getConversations(id);
      setDisplayConversations(data.conversations ?? []);
    } finally {
      setIsConversationsLoading(false);
    }
  };

  const sendText = async (text: string) => {
    const t = text.trim();
    if (!t) return;

    setIsSending(true);
    try {
      let id = chatId;

      
      if (!id) {
        if (!onNeedCreateChat) {
          throw new Error("ChatId is null but onNeedCreateChat is not provided.");
        }
        const created = await onNeedCreateChat(t);
        id = created.chatId;
        router.push(`/c/${id}`);
        clearDisplayConversations(); 
      }
    
      appendConversation({
        text: t,
        registeredAt: new Date().toISOString(),
        side: "User",
      });
      await chatService.sendMessage(id, t);

     
      await loadConversations(id);
    } finally {
      setIsSending(false);
    }
  };


  useEffect(() => {
    if (!chatId) {
      clearDisplayConversations();
      return;
    }
    loadConversations(chatId).catch(() => {});
  }, [chatId]);

  return {
    isConversationsLoading,
    isSending,
    loadConversations,
    sendText,
  };
}
