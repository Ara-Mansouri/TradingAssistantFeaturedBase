"use client";
import { useState, useEffect } from "react";
import { useMicVolume } from "../hooks/useMicVolume";
//import { useVoiceHub } from "../hooks/useVoiceHub";
import VoiceOrb from "./VoiceOrb";
import { useTranslations } from "next-intl";
import { useConversation } from "@/features/conversation/context/useConversation";
import { useMockVoiceApi, USE_MOCK_API } from "../hooks/useMockVoiceApi";
import { ChatMessage } from "@/features/chat/components/ChatBubble";//اضافه کردن  پیغام و ریسپانس به چت مسیج
//  const { status, response,setResponse,sessionReady,startRecording, stopRecording , leaveSession } = useVoiceHub();
// determine screen size for orb display
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => 
    {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

interface VoiceRecorderProps 
{
  showText?: boolean; 
}

export default function VoiceRecorder({ showText = false }: VoiceRecorderProps) 
{
  const { addMessage } = useConversation();
  const t = useTranslations("Dashboard");
  const isMobile = useIsMobile();
  const mockApi = useMockVoiceApi();
  const isRecording = mockApi.isRecording;
  //  const isRecording = status.startsWith("Recording");
  const volume = useMicVolume(isRecording);

  // Handle transcription and AI response in Voice+Text mode
  const [processedTranscriptionId, setProcessedTranscriptionId] = useState<string | null>(null);

  useEffect(() => {
    if (!showText || !mockApi.mockFinalTranscription || !mockApi.mockAiResponse) return;
    
    // Prevent duplicate processing
    const transcriptionId = mockApi.mockFinalTranscription;
    if (processedTranscriptionId === transcriptionId) return;

    setProcessedTranscriptionId(transcriptionId);

    // Add user message (transcription)
    const userMessage: ChatMessage = 
    {
      id: `user-${Date.now()}`,
      role: "user",
      content: mockApi.mockFinalTranscription,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    // Add assistant message (AI response)
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: mockApi.mockAiResponse,
      timestamp: new Date(),
    };
    
    // Small delay to simulate AI processing
    setTimeout(() => {
      addMessage(assistantMessage);
      // Reset after a delay to allow for next recording
      setTimeout(() => {
        mockApi.reset();
        setProcessedTranscriptionId(null);
      }, 1000);
    }, 300);
  }, [mockApi.mockFinalTranscription, mockApi.mockAiResponse, showText, addMessage, processedTranscriptionId]);

// TODO :FIX HANDLE TOGGLE FOR API
  const handleToggle = async () => {
    if (isRecording) 
    {
      // Stop recording and finalize
      await mockApi.finalizeMockRecording();
    } 
    else
    {
      // Start recording
      mockApi.startMockRecording();
    }
  };

  const orbSize = showText ? (isMobile ? 100 : 260) : 260;

  return (
    <div className="relative flex flex-col items-center justify-center bg-cover bg-center bg-black text-white animate-fade-in">
      <VoiceOrb
      //onToggle={isRecording ? stopRecording : startRecording}
      // disabled={!sessionReady}
        isRecording={isRecording}
        volume={volume}
        onToggle={handleToggle}
        disabled={true} //TODO : FIX DISABLED FOR ACTUAL API //orb is disabled for now
        size={orbSize}
      />
{/* 
      <p className="mt-3 text-sm text-gray-400">
        {isRecording ? t("stop") || "Stop" : t("start") || "Start"}
      </p> */}

    </div>
  );
}
