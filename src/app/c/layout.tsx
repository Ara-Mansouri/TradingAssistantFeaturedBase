// app/c/layout.tsx
"use client";

import { useParams } from "next/navigation";
import ConversationLayout from "@/features/conversation/components/ConversationLayout";
import AppSidebar from "@/features/chat/components/AppSidebar";
import { useChatsList } from "@/features/chat/hooks/useChatsList";
import { useEffect } from "react";
import { ConversationProvider } from "@/features/conversation/context/ConversationContext";
import { ChatsProvider } from "@/features/chat/context/chatContext";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
const activeChatId = (params as any)?.chatId ?? null;

useEffect(() => {
  console.log("C Layout MOUNT");
  return () => console.log("C Layout UNMOUNT");
}, []);

  const chats = useChatsList(); 

  return (
     <ConversationProvider>
      <ChatsProvider value={chats}>
    <ConversationLayout
      sidebar={
        <AppSidebar
          chats={chats.chats}
          selectedChatId={activeChatId}   
          isLoading={chats.isChatsLoading}
          onNewChat={async () => {
            await chats.newChat();
          }}
          onSelect={chats.goToChat}
          onRename={chats.renameChat}
        />
      }
    >
      {children}
    </ConversationLayout>
    </ChatsProvider>
    </ConversationProvider>
  );
}
