"use client";

import { useConversation } from "../context/useConversation";
import VoiceRecorder from "@/features/voice/components/VoiceRecorder";
import MessageList from "@/features/chat/components/MessageList";
import ChatContainer from "./ChatContainer";
import ResponsiveGrid from "./ResponsiveGrid";

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
        <ChatContainer>
          <MessageList messages={messages} />
        </ChatContainer>
      }
    />
  );
}
