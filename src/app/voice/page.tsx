"use client";

import { useEffect } from "react";
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import VoiceRecorder from "@/features/voice/components/VoiceRecorder";

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
      <div className="flex justify-center items-center h-[100svh] bg-black text-white">
       <VoiceRecorder />
      </div>

  );
  }
