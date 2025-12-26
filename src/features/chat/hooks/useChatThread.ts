"use client";

import { useEffect, useRef,useState } from "react";
import { useRouter } from "next/navigation";
import { chatService } from "@/features/chat/services/ChatService";
import { useConversation } from "@/features/conversation/context/useConversation";
import { useMutation } from "@tanstack/react-query";

export function useChatThread(opts: {
  chatId: string | null;
  onNeedCreateChat?: (firstMessageText: string) => Promise<{ chatId: string }>;
}) {
  const { chatId, onNeedCreateChat } = opts;

  const router = useRouter();
  const { setDisplayConversations, clearDisplayConversations , appendConversation } = useConversation();

  const [isConversationsLoading, setIsConversationsLoading] = useState(false);
  const latestRequestId = useRef(0);
  const sendMessageMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => chatService.sendMessage(id, text),
  });
  const loadConversations = async (id: string) => {
    const requestId = ++latestRequestId.current;
    setIsConversationsLoading(true);
    setDisplayConversations([]);
    try {
      const data = await chatService.getConversations(id);
      if (requestId === latestRequestId.current) {
        setDisplayConversations(data.conversations ?? []);
      }
    } finally {
      if (requestId === latestRequestId.current) {
        setIsConversationsLoading(false);
      }
    }
  };

  const sendText = async (text: string) => {
    const t = text.trim();
    if (!t) return;
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

      await sendMessageMutation.mutateAsync({ id, text: t }); // Send message to server first
      appendConversation({
        text: t,
        registeredAt: new Date().toISOString(),
        side: "User",
      });

      await loadConversations(id);
    } catch (error) {

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
    isSending: sendMessageMutation.isPending,
    loadConversations,
    sendText,
  };
}
