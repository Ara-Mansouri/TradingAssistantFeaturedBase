"use client";

import { useConversation } from "../context/useConversation";

export default function ModeSwitcher() {
  const { mode, setMode } = useConversation();

  return (
    <div className="flex items-center bg-[#1d1d1d]/70 border border-[#3b3b3b] px-2 py-1.5 rounded-full gap-1 shadow-lg backdrop-blur-md">

      <button
        onClick={() => setMode("chat")}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200
          ${mode === "chat"
            ? "bg-[#771313]/60 text-white border border-[#771313]/80 shadow-md shadow-[#771313]/20"
            : "text-gray-300 hover:text-white hover:bg-gray-800/50"}
        `}
        aria-label="Chat Mode"
      >
        <span
          className={`
            w-2.5 h-2.5 rounded-full transition-all
            ${mode === "chat"
              ? "bg-[#771313] shadow-[0_0_8px_rgba(119,19,19,0.6)]"
              : "bg-gray-400"}
          `}
        />
        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Chat</span>
      </button>


      <div className="w-px h-4 bg-gray-500/50"></div>


      <button
        onClick={() => setMode("voice")}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200
          ${mode === "voice"
            ? "bg-[#771313]/60 text-white border border-[#771313]/80 shadow-md shadow-[#771313]/20"
            : "text-gray-300 hover:text-white hover:bg-gray-800/50"}
        `}
        aria-label="Voice Mode"
      >
        <span
          className={`
            w-2.5 h-2.5 rounded-full transition-all
            ${mode === "voice"
              ? "bg-[#771313] shadow-[0_0_8px_rgba(119,19,19,0.6)]"
              : "bg-gray-400"}
          `}
        />
        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Talk</span>
      </button>

      {/* Divider */}
      <div className="w-px h-4 bg-gray-500/50"></div>

      {/* Voice + Text Mode */}
      <button
        onClick={() => setMode("voice+text")}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200
          ${mode === "voice+text"
            ? "bg-[#771313]/60 text-white border border-[#771313]/80 shadow-md shadow-[#771313]/20"
            : "text-gray-300 hover:text-white hover:bg-gray-800/50"}
        `}
        aria-label="Voice + Text Mode"
      >
        <span
          className={`
            w-2.5 h-2.5 rounded-full transition-all
            ${mode === "voice+text"
              ? "bg-[#771313] shadow-[0_0_8px_rgba(119,19,19,0.6)]"
              : "bg-gray-400"}
          `}
        />
        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Talk & Text</span>
      </button>
    </div>
  );
}
