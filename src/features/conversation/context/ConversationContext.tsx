"use client";

import { createContext } from "react";
import { useState } from "react";

export type ConversationMode = "chat" | "voice" | "voice+text";
export interface ConversationContextValue 
{
 mode : ConversationMode ,
 setMode : (m : ConversationMode) => void;
}

export const ConversationContext = createContext<ConversationContextValue | null >(null);


export function  ConversationProvider({ children }: { children: React.ReactNode })
{
    const [mode , setMode] = useState<ConversationMode>("chat") ;
    return (
            <ConversationContext.Provider value={{mode , setMode}}>
            {children}
            </ConversationContext.Provider>
    );
}