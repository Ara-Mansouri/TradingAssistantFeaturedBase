"use client";

import { useConversation } from "../context/useConversation";
import ChatInputBar from "@/features/chat/components/ChatInputBar";
import VoiceRecorder from "@/features/voice/components/VoiceRecorder";
import MessageList from "@/features/chat/components/MessageList";
import OrbContainer from "./OrbContainer";
import ChatContainer from "./ChatContainer";
import ResponsiveGrid from "./ResponsiveGrid";

export default function ConversationShell()
{
  const { mode, messages } = useConversation();

  // Chat Mode: Messages + Text input
  if (mode === "chat")
    {
    return (
      <div className="h-full flex flex-col overflow-hidden">

        {messages.length === 0 ?
        (
          <div className="flex flex-1 flex-col items-center justify-center pb-24 ">
                <ChatInputBar hasMessages = {messages.length>0} />
          </div>
        ) :
        (
          <>
            <div className="flex flex-1 min-h-0 overflow-y-auto">
            <MessageList messages={messages}/>
            </div>
            <div className="flex-shrink-0 border-t border-gray-800/50 bg-black/50 backdrop-blur-sm">
            <ChatInputBar hasMessages = {messages.length>0} />
            </div>
          </>
            
          

        )
        }
      </div>
      // <div className="h-full flex flex-col overflow-hidden">
      //   {messages.length > 0 ? (
      //     <div className="flex-1 min-h-0 overflow-y-auto">
      //       <MessageList messages={messages} />
      //     </div>
      //   ) : (
      //     <div className="flex-1 flex items-center justify-center">

      //     </div>
      //   )}

      //   <div className="flex-shrink-0 border-t border-gray-800/50 bg-black/50 backdrop-blur-sm">
      //     <ChatInputBar hasMessages={messages.length > 0} />
      //   </div>
      // </div>
    );
  }


  if (mode === "voice") {
    return (
      <div className="h-full flex items-center justify-center">
       
          <VoiceRecorder showText={false} />
       
      </div>
    );
  }

  // Voice + Text Mode: Orb + Chat messages
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
