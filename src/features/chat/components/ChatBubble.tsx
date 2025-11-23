"use client";

import { useLocale } from "next-intl";

export type MessageRole = "user" | "assistant";

export interface ChatMessage 
{
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface ChatBubbleProps
{
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) 
{
  const locale = useLocale();
  const isRTL = locale === "fa";
  const isUser = message.role === "user";

  return (
    <div
      className={`flex  mb-4 animate-fade-in
     ${
        isUser ? "justify-end" : "justify-start"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`
    // max-w-[80%] sm:max-w-[70%] md:max-w-[60%]
    ${isUser ? "rounded-2xl px-4 py-3" : "px-1 py-1"}
    ${
      isUser
        ? "bg-[#771313]/80 backdrop-blur-md border border-[#5c0505]/40 text-white"
        : " max-w-[100%] md:max-w-[100%] bg-transparent text-gray-300"
    }
  `}
      >
        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <span
          className={`text-xs text-gray-400 mt-1 block ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {/* {message.timestamp.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
          })} */}
        </span>
      </div>
    </div>
  );
}

