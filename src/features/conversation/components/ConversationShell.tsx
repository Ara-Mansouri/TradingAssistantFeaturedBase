"use client";

import VoiceRecorder from "@/features/voice/components/VoiceRecorder";
import ResponsiveGrid from "./ResponsiveGrid";
import MessageList from "@/features/chat/components/MessageList";
import ChatInputBar from "@/features/chat/components/ChatInputBar";


import { useConversation } from "@/features/conversation/context/useConversation";
import { useChatThread } from "@/features/chat/hooks/useChatThread";
export type ChatThread = ReturnType<typeof useChatThread>;

export default function ConversationShell({ chat }: { chat: ChatThread }) {
  const { displayConversations } = useConversation();

  return (
    <div className="h-full flex">

      <div className="flex-1 min-w-0">
        <ResponsiveGrid
          leftPanel={
            <div className="h-full flex items-center justify-center md:py-0 py-4">
              <VoiceRecorder showText={true} />
            </div>
          }
          rightPanel={
            <div className="flex flex-col h-full">
              <div className="flex-1 min-h-0 overflow-y-auto">
                <MessageList items={displayConversations} />
              </div>

              <div className="flex-shrink-0 border-t border-gray-800/50 bg-black/50 backdrop-blur-sm">
                <ChatInputBar onSend={chat.sendText} isSending={chat.isSending} />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}
