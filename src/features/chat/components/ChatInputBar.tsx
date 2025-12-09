"use client";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useConversation } from "@/features/conversation/context/useConversation";
import { ChatMessage } from "./ChatBubble";



export default function ChatInputBar() 
{
 
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const { addMessage } = useConversation();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

//   const goToWave = () => {
//     setMode("voice");
//   };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputText.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputText("");
    setIsLoading(true);

    setTimeout(() => {
    const mockResponses = "This message is a placeholder mock response used exclusively for validating AI integration and UI behavior.";

      const aiResponse: ChatMessage = 
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: mockResponses,
        timestamp: new Date(),
      };
      addMessage(aiResponse);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col items-center z-40 px-4 py-4" dir={locale === "fa" ? "rtl" : "ltr"}>
      {/* {!hasMessages && (
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-2 tracking-tight">
            <div
              aria-hidden
              className="
                pointer-events-none absolute -z-10
                left-1/2 -translate-x-1/2
                top-[45%]
                w-full             
                max-w-[45rem]      
                h-[5rem]          
                rounded-full
                bg-gradient-to-r from-red-800/25 via-red-600/15 to-transparent
                blur-[50px] opacity-100
                rotate-[-24deg]
                md:top-[22%]
                md:max-w-[55rem]  
                md:h-[15rem]
                md:opacity-60
                md:rotate-[-26deg]
              "
            />
            {t("welcome")}
          </h1>
        </div>
      )} */}
      <div className="w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div
            className="
              w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl sm:rounded-3xl
              bg-white/5 backdrop-blur-md border border-white/10
              shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(185,28,28,0.2)]
              transition-all duration-300 hover:border-red-500/30
            "
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 
                       px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base
                       focus:placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all 
                       hover:bg-gray-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white opacity-80"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
            {/* <button
              type="button"
              onClick={goToWave}
              className="
                w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center 
                rounded-full bg-[#771313]
                border border-[#5c0505]/40
                hover:shadow-red-900/40
                transition-all duration-300
                transform hover:scale-105 active:scale-95
                group
              "
              aria-label="Voice input"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white group-hover:text-red-100 transition-colors"
              >
                <rect x="6" y="8" width="2" height="8" rx="1" />
                <rect x="11" y="6" width="2" height="12" rx="1" />
                <rect x="16" y="8" width="2" height="8" rx="1" />
              </svg>
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
}
