import { useEffect, useRef, useState } from "react";
import { VoiceService } from "../services/voiceService";

export function useVoiceHub() {
  const [status, setStatus] = useState("Disconnected");
  const [response, setResponse] = useState<string | null>(null);
  const svcRef = useRef<VoiceService | null>(null);

  useEffect(() => {
    const svc = new VoiceService();
    svcRef.current = svc;

    svc.connect(setResponse, setStatus).catch((err) => {
      console.error("Hub connect failed:", err);
      setStatus("Failed");
    });

    return () => {
      svc.disconnect().catch(() => {});
    };
  }, []);

  return {
    status,
    response,
    setResponse, 
    startRecording: () => svcRef.current?.startRecording(setStatus),
    stopRecording: () => svcRef.current?.stopRecording(setStatus),
  };
}
