"use client";

import React from "react";
import { VoiceOrbPanel } from "@/features/dashboard/components/VoiceOrb";

export default function DashboardPage() {
  return (
    <main className="min-h-[60vh] w-full flex items-center justify-center bg-transparent p-6">
      <div className="flex flex-col items-center gap-6">
        <VoiceOrbPanel
          initialListening={false}
          orbSizeClass="w-56 h-56 md:w-64 md:h-64"
          color="#D41414"
          sensitivity={1.0}
        />
        <p className="text-sm text-neutral-300">
          Your Trading Assistant is ready. Tap Start Listening to speak.
        </p>
      </div>
    </main>
  );
}