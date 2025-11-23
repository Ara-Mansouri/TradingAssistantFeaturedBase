"use client";

import { useConversation } from "../context/useConversation";

export default function ModeSwitcher() {
  const { mode, setMode } = useConversation();

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="
        flex items-center bg-[#1d1d1d]/70 border border-[#3b3b3b] 
        px-3 py-2 rounded-full gap-3 shadow-lg backdrop-blur-md
      ">

        <button
          onClick={() => setMode("voice")}
          className={`
            flex items-center gap-2 px-3 py-1 rounded-full transition-all
            ${mode === "voice"
              ? "bg-[#2b2b2b] text-blue-400 border border-blue-500/60 shadow-md"
              : "text-gray-300 hover:text-white"}
          `}
        >
          <span
            className={`
              w-3.5 h-3.5 rounded-full border 
              ${mode === "voice"
                ? "border-blue-400 bg-blue-500/40"
                : "border-gray-400"}
            `}
          />
          <span className="text-sm font-medium">Voice Mode</span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-500/50"></div>

        {/* Voice + Text */}
        <button
          onClick={() => setMode("voice+text")}
          className={`
            flex items-center gap-2 px-3 py-1 rounded-full transition-all
            ${mode === "voice+text"
              ? "bg-[#2b2b2b] text-blue-400 border border-blue-500/60 shadow-md"
              : "text-gray-300 hover:text-white"}
          `}
        >
          <span
            className={`
              w-3.5 h-3.5 rounded-full border 
              ${mode === "voice+text"
                ? "border-blue-400 bg-blue-500/40"
                : "border-gray-400"}
            `}
          />
          <span className="text-sm font-medium">Voice + Text</span>
        </button>

      </div>
    </div>
  );
}
