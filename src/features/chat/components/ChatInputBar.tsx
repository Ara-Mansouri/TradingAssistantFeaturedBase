"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function ChatInputBar(props: {
  onSend: (text: string) => Promise<void>;
  isSending: boolean;
}) {
  const { onSend, isSending } = props;
  const locale = useLocale();
    const t = useTranslations("Dashboard");
  const [inputText, setInputText] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isSending) return;

    setInputText("");
    await onSend(text);
  };

  return (
    <div className="w-full flex flex-col items-center z-40 px-4 py-4" dir={locale === "fa" ? "rtl" : "ltr"}>
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
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
