"use client";

import { useLocale } from "next-intl";
import type { ConversationDto } from "@/features/chat/types/chatApi";

export default function ChatBubble({ item }: { item: ConversationDto }) {
  const locale = useLocale();
  const isRTL = locale === "fa";
  const isUser = item.side === "User";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={`
          ${isUser ? "rounded-2xl px-4 py-3" : "px-1 py-1"}
          ${
            isUser 
            ? "bg-[#771313]/80 backdrop-blur-md border border-[#5c0505]/40 text-white" 
              : " max-w-[100%] md:max-w-[100%] bg-transparent text-gray-300"
                  }        `}
      >
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{item.text}</p>
        <span
          className={`text-xs text-gray-400 mt-1 block ${
            isUser ? "text-right" : "text-left"
          }`}
        >
        </span>
      </div>
    </div>
  );
}
 