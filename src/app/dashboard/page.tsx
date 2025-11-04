"use client";

import { useState } from "react";
import { VoiceOrb } from "@/features/orb/VoiceOrb";
import { useMic } from "@/features/orb/hooks/useMic";

export default function DashboardPage() {
  const [listening, setListening] = useState(false);
  const { amp, ready, error } = useMic({ enabled: listening, smoothingTimeConstant: 0.85, fftSize: 1024 });

  const handleToggle = () => {
    setListening((prev) => !prev);
  };

  const helperText = error
    ? `Microphone error: ${error}`
    : listening
      ? ready
        ? "Listening... speak naturally into the microphone."
        : "Awaiting microphone permission..."
      : "Tap Start Listening to activate the plasma orb.";

  return (
    <main className="min-h-[70vh] grid place-items-center bg-[#0b0b0b] px-6 py-16 text-white">
      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="relative flex flex-col items-center">
          <VoiceOrb size={360} color="#D41414" sensitivity={1.0} amp={amp} />
          <div className="absolute left-1/2 top-full mt-10 h-[80px] w-[60vw] max-w-[580px] -translate-x-1/2 rounded-full bg-[#d41414]/60 blur-3xl opacity-50 -z-10" />
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`relative rounded-full px-6 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D41414]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b] ${
            listening
              ? "bg-[#D41414]/20 text-[#ffbfbf] shadow-[0_0_40px_rgba(212,20,20,0.25)]"
              : "bg-[#D41414] text-white shadow-[0_10px_35px_rgba(212,20,20,0.45)] hover:bg-[#e02222]"
          }`}
        >
          {listening ? "Stop Listening" : "Start Listening"}
        </button>
        <p className="text-sm text-neutral-300 max-w-[360px]">{helperText}</p>
      </div>
    </main>
  );
}
