"use client";

import { useEffect } from "react";
import VoiceRecorder from "@/features/voice/components/VoiceRecorder";
import LanguageSwitcher from "@/features/common/LanguageSwitcher";


export default function VociePage() 
{

  useEffect(() => 
  {
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

      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      <div className="flex justify-center items-center h-full">
        <VoiceRecorder />
      </div>

    </div>

  );
  }
