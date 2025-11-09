"use client";
import { useVoiceHub } from "../hooks/useVoiceHub";
import { useMicVolume } from "../hooks/useMicVolume";
import { useRouter } from "next/navigation";
import VoiceOrb from "./VoiceOrb";

export default function VoiceRecorder() {
  const { status, response,setResponse,startRecording, stopRecording } = useVoiceHub();
const router = useRouter();

  const isRecording = status.startsWith("Recording");
   const volume = useMicVolume(isRecording);
  return (
<div className="relative flex flex-col items-center justify-center  bg-cover bg-center bg-black text-white">
      <p className="text-gray-400 mb-4">{status}</p>

      <VoiceOrb
        isRecording={isRecording}
         volume={volume}
        onToggle={isRecording ? stopRecording : startRecording}
        size={260}
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
        <button
      onClick={() => 
       { 
          if (isRecording) stopRecording(); 
          setResponse(null);              
         router.push("/dashboard");       
       }}

      className="
        absolute left-1/2 -bottom-15 -translate-x-1/2 
        w-10 h-10 rounded-full
        bg-gray-700/60 backdrop-blur-md
        flex items-center justify-center
        hover:bg-gray-600/70 transition-all
        shadow-lg
      "
    >
      <svg width="20" height="20" viewBox="0 0 24 24" className="text-white">
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6l12 12M18 6L6 18"
        />
      </svg>
    </button>
    </div>
  );
}
