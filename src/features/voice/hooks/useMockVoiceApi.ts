"use client";

import { useState, useCallback, useRef } from "react";


export interface MockVoiceApi {
  startMockRecording: () => void;
  sendMockAudioChunk: (chunk: Blob) => void;
  finalizeMockRecording: () => Promise<{
    transcription: string;
    aiResponse: string;
    voiceOutputUrl?: string;
  }>;
  mockPartialTranscriptionStream: string | null;
  mockFinalTranscription: string | null;
  mockAiResponse: string | null;
  mockVoiceOutputUrl: string | null;
  isRecording: boolean;
  reset: () => void;
}


const MOCK_AI_RESPONSES = 
  "Based on current macroeconomic indicators, liquidity cycles, and historical halving events, the probability of Bitcoin reaching $100,000 in the next market cycle is significant. However, ETF inflows, miner capitulation phases, and global risk sentiment will remain the primary drivers influencing whether this target is reached sustainably.";

const MOCK_TRANSCRIPTIONS = 
"What is your full analysis of whether Bitcoin can reach $100,000 in the next market cycle, considering macroeconomic trends, liquidity flows, ETF demand, miner selling pressure, and historical halving patterns?";

// Flag to enable/disable mock API
export const USE_MOCK_API = true;

export function useMockVoiceApi(): MockVoiceApi {
  const [isRecording, setIsRecording] = useState(false);
  const [mockPartialTranscriptionStream, setMockPartialTranscriptionStream] = useState<string | null>(null);
  const [mockFinalTranscription, setMockFinalTranscription] = useState<string | null>(null);
  const [mockAiResponse, setMockAiResponse] = useState<string | null>(null);
  const [mockVoiceOutputUrl, setMockVoiceOutputUrl] = useState<string | null>(null);

  const transcriptionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const selectedTranscriptionRef = useRef<string>("");
  const selectedResponseRef = useRef<string>("");

  const startMockRecording = useCallback(() => {
    setIsRecording(true);
    setMockPartialTranscriptionStream("");
    setMockFinalTranscription(null);
    setMockAiResponse(null);
    setMockVoiceOutputUrl(null);


    selectedTranscriptionRef.current = MOCK_TRANSCRIPTIONS;
    selectedResponseRef.current = MOCK_AI_RESPONSES;

    // Simulate streaming transcription (like Whisper)
    let currentIndex = 0;
    const fullText = selectedTranscriptionRef.current;

    transcriptionIntervalRef.current = setInterval(() => {
      if (currentIndex < fullText.length) {
        // Simulate word-by-word  streaming
        const nextWordEnd = fullText.indexOf(" ", currentIndex);
        const nextIndex = nextWordEnd !== -1 ? nextWordEnd + 1 : fullText.length;
        const partial = fullText.slice(0, nextIndex);
        setMockPartialTranscriptionStream(partial);
        currentIndex = nextIndex;
      } else {
        // Transcription complete
        if (transcriptionIntervalRef.current) {
          clearInterval(transcriptionIntervalRef.current);
          transcriptionIntervalRef.current = null;
        }
        setMockFinalTranscription(fullText);
      }
    }, 150); 
  }, []);

  const sendMockAudioChunk = useCallback((chunk: Blob) => 
  {

    if (!isRecording) return;

  }, [isRecording]);

  const finalizeMockRecording = useCallback(async (): Promise<{
    transcription: string;
    aiResponse: string;
    voiceOutputUrl?: string;
  }> => {
    setIsRecording(false);


    if (transcriptionIntervalRef.current) 
    {
      clearInterval(transcriptionIntervalRef.current);
      transcriptionIntervalRef.current = null;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const transcription = selectedTranscriptionRef.current || mockPartialTranscriptionStream || "";
    const aiResponse = selectedResponseRef.current || MOCK_AI_RESPONSES;

    setMockFinalTranscription(transcription);
    setMockAiResponse(aiResponse);

    // Simulate voice output URL (in real implementation, this would be a TTS endpoint)
    const voiceUrl = `mock://voice-output-${Date.now()}.mp3`;
    setMockVoiceOutputUrl(voiceUrl);

    return {
      transcription,
      aiResponse,
      voiceOutputUrl: voiceUrl,
    };
  }, [mockPartialTranscriptionStream]);

  const reset = useCallback(() => {
    setIsRecording(false);
    setMockPartialTranscriptionStream(null);
    setMockFinalTranscription(null);
    setMockAiResponse(null);
    setMockVoiceOutputUrl(null);
    if (transcriptionIntervalRef.current) {
      clearInterval(transcriptionIntervalRef.current);
      transcriptionIntervalRef.current = null;
    }
  }, []);

  return {
    startMockRecording,
    sendMockAudioChunk,
    finalizeMockRecording,
    mockPartialTranscriptionStream,
    mockFinalTranscription,
    mockAiResponse,
    mockVoiceOutputUrl,
    isRecording,
    reset,
  };
}

