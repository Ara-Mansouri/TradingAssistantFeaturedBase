"use client";

import { useConversation } from "../context/useConversation";
import VoiceRecorder from "@/features/voice/components/VoiceRecorder";
import MessageList from "@/features/chat/components/MessageList";
import ChatContainer from "./ChatContainer";
import ResponsiveGrid from "./ResponsiveGrid";
import ChatInputBar from "@/features/chat/components/ChatInputBar";

export default function ConversationShell()
{
  const { messages } = useConversation();

  return (
    <ResponsiveGrid
      leftPanel={
        <div className="h-full flex items-center justify-center md:py-0 py-4">
            <VoiceRecorder showText={true} />
        </div>
      }
      rightPanel={
        <>
        <div className="flex flex-col h-full">
  
       <div className="flex-1 min-h-0">
          <MessageList messages={messages} />
       </div>

      {/* Input Bar */}
      <div className="flex-shrink-0 border-t border-gray-800/50 bg-black/50 backdrop-blur-sm">
         <ChatInputBar />
      </div>

     </div>

      </>
      }
    />
  );
}
