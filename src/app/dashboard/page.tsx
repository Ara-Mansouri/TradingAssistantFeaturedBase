"use client";

import { useEffect } from "react";
import { ConversationProvider } from "@/features/conversation/context/ConversationContext";
import ConversationShell from "@/features/conversation/components/ConversationShell";
import ConversationLayout from "@/features/conversation/components/ConversationLayout";


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
    <ConversationProvider>
      <ConversationLayout>
        <ConversationShell />
      </ConversationLayout>
    </ConversationProvider>
  );
  }
