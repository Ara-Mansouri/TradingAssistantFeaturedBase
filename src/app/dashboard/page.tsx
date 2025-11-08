"use client";

import { useEffect } from "react";
import VoiceRecorder from "@/features/voice/components/VoiceRecorder";
import LanguageSwitcher from "@/features/common/LanguageSwitcher";
import UserMenu from "@/features/dashboard/components/UserMenu";
import ChatInputBar from "@/features/chat/components/ChatInputBar";

export default function WelcomePage() {
  useEffect(() => {
    
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

   return (
  <div className="relative h-[100svh] bg-black text-white">
        <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-20">
        <UserMenu />    
        <LanguageSwitcher />   
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <ChatInputBar />
      </div>
      </div>
  );
  }
