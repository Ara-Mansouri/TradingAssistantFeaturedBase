"use client";

import { useEffect, useRef } from "react";
import { ChatService } from "../services/ChatService";
import {IchatTransport} from "../core/IChatTransport"
import { useConversation } from "@/features/conversation/context/useConversation";
import {chatTransport} from "../services/chatTransportFactory"

export function useChat(chatId: string) {
  const { addMessage } = useConversation();
  const transportRef  = useRef<IchatTransport | null>(null);

  useEffect(() => {
    const svc = chatTransport();
    transportRef .current = svc;

    svc.connect(chatId, (incoming) => {
      addMessage({
        id: incoming.id,
        role: incoming.sender,
        content: incoming.content,
        timestamp: new Date(incoming.timestamp),
      });
    });

    return () => {
      svc.disconnect();
    };
  }, [chatId, addMessage]);

  const send = async (content: string) => {
    const dto = await transportRef.current?.sendMessage(content);
    if (!dto) return;

    addMessage({
      id: dto.id,
      role: "user",
      content: dto.content,
      timestamp: new Date(dto.timestamp),
    });
  };

  return { send };
}
