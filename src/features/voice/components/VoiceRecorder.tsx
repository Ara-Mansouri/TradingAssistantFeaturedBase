"use client";
import { useVoiceHub } from "../hooks/useVoiceHub";
import { useMicVolume } from "../hooks/useMicVolume";
import { useRouter } from "next/navigation";
import VoiceOrb from "./VoiceOrb";
import { useTranslations } from "next-intl";
import { useConversation } from "@/features/conversation/context/useConversation";

export default function VoiceRecorder() {
  const { status, response,setResponse,sessionReady,startRecording, stopRecording , leaveSession } = useVoiceHub();
  const { setMode } = useConversation();
  const router = useRouter();
  const t = useTranslations("Dashboard");
  const isRecording = status.startsWith("Recording");
  const volume = useMicVolume(isRecording);
  return (
<div className="relative flex flex-col items-center justify-center  bg-cover bg-center bg-black text-white">
      {/* <p className="text-gray-400 mb-4">{status}</p> */}

      <VoiceOrb
        isRecording={isRecording}
         volume={volume}
        onToggle={isRecording ? stopRecording : startRecording}
        disabled={!sessionReady}
        size={260}
      />

      <p className="mt-3 text-sm text-gray-400">
        {isRecording ? t("stop") : t("start")}
      </p>

      {response && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg w-[400px] text-center  overflow-y-auto max-h-[200px] break-word ">
          <p className="text-sm text-gray-200">{response}</p>
        </div>
      )}
        <button
       onClick={async () => 
        {
         if (isRecording) 
         {
          await stopRecording();
         }
         await leaveSession();  
        setResponse(null);
       setMode("chat");
            
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
