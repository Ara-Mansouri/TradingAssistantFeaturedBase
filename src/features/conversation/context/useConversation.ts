"use client"

import  { useContext } from "react"
import {ConversationContext} from "./ConversationContext"


export function useConversation()
{
    const ctx = useContext(ConversationContext);
    if (!ctx) 
    {
    throw new Error("useConversation must be used inside <ConversationProvider>");
    }
    return ctx;

}


