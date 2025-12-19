"use client";

import { useEffect } from "react";
import { ConversationProvider } from "@/features/conversation/context/ConversationContext";
import ConversationLayout from "@/features/conversation/components/ConversationLayout";
import ConversationShell from "@/features/conversation/components/ConversationShell";

import AppSidebar from "@/features/chat/components/AppSidebar";
import { useChatFlow } from "@/features/chat/hooks/useChatFlow";

export default function WelcomePage() {
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <ConversationProvider>
      <PageBody />
    </ConversationProvider>
  );
}

function PageBody() {
  const chat = useChatFlow();

  return (
    <ConversationLayout
      sidebar={
        <AppSidebar
          chats={chat.chats}
          selectedChatId={chat.selectedChatId}
          isLoading={chat.isChatsLoading}
          onNewChat={async () => {
            await chat.newChat("Chat");
          }}
          onSelect={chat.selectChat}
          onRename={chat.renameChat}
        />
      }
    >
      <ConversationShell chat={chat} />
    </ConversationLayout>
  );
}
