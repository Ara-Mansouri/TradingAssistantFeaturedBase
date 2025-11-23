"use client";

import { useConversation } from "../context/useConversation";
import ChatInputBar from "@/features/chat/components/ChatInputBar";
import VoiceRecorder from "@/features/voice/components/VoiceRecorder";
import ModeSwitcher from "@/features/conversation/components/ModeSwitcher";

export default function ConversationShell() {
  const { mode } = useConversation();

  return (
    <>
      {mode === "chat" && <ChatInputBar />}

      {mode === "voice" && (
        <div className="flex justify-center items-center h-full">
          <ModeSwitcher />
          <VoiceRecorder />
        </div>
      )}

      {mode === "voice+text" && (
        <div className="flex flex-col h-full">
          <div className="grow bg-black/20">
            <p className="text-white text-center mt-10">Text area for voice+text here...</p>
          </div>

          {/* Orb */}
          <div className="flex justify-center mb-10">
            <ModeSwitcher />
            <VoiceRecorder />
          </div>
        </div>
      )}
    </>
  );
}
