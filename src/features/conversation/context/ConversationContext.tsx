"use client";

import { createContext } from "react";
import { useState } from "react";
import { ChatMessage } from "@/features/chat/components/ChatBubble";

export type ConversationMode = "chat" | "voice" | "voice+text";
export interface ConversationContextValue 
{
 mode : ConversationMode ,
 setMode : (m : ConversationMode) => void;
 messages: ChatMessage[];
 addMessage: (message: ChatMessage) => void;
 clearMessages: () => void;
}

export const ConversationContext = createContext<ConversationContextValue | null >(null);


export function  ConversationProvider({ children }: { children: React.ReactNode })
{
    const [mode , setMode] = useState<ConversationMode>("chat") ;
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const addMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const clearMessages = () => {
      setMessages([]);
    };

    return (
            <ConversationContext.Provider value={{mode , setMode, messages, addMessage, clearMessages}}>
            {children}
            </ConversationContext.Provider>
    );
}