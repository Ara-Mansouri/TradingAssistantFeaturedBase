"use client";

import { useChats } from "@/features/chat/context/chatContext";
import { useChatsList } from "@/features/chat/hooks/useChatsList";
import { useChatThread } from "@/features/chat/hooks/useChatThread";
import ConversationShell from "@/features/conversation/components/ConversationShell";
import { useEffect } from "react";

export default function NewChatPage()
{  
   useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const chats = useChats();
  const thread = useChatThread({ 
    chatId: null ,
    onNeedCreateChat : async (firstMessageText)  =>
    {
       const created = await chats.createChatFromFirstMessage(firstMessageText);

      return { chatId: created.chatId };
    }
  });
  return <ConversationShell chat={thread} />;
}
