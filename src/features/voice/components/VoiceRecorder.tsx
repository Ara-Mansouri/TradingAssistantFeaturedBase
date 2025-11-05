"use client";
import { useVoiceHub } from "../hooks/useVoiceHub";
import VoiceOrb from "./VoiceOrb";

export default function VoiceRecorder() {
  const { status, response, startRecording, stopRecording } = useVoiceHub();

  const isRecording = status.startsWith("Recording");

  return (
<div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-black text-white">

      <h2 className="text-2xl font-bold mb-6">Trading Assistent</h2>

      <p className="text-gray-400 mb-4">{status}</p>

      <VoiceOrb
        isRecording={isRecording}
        onToggle={isRecording ? stopRecording : startRecording}
        size={250}
      />

      <p className="mt-3 text-sm text-gray-400">
        {isRecording ? "Tap to stop" : "Tap to speak"}
      </p>

      {response && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg w-[400px] text-center">
          <h3 className="text-lg font-semibold mb-2">AI Response</h3>
          <p className="text-sm text-gray-200">{response}</p>
        </div>
      )}
    </div>
  );
}
