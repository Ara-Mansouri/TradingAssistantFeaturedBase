import { useEffect, useRef, useState } from "react";
import { VoiceService } from "../services/voiceService";

export function useVoiceHub() {
  const [status, setStatus] = useState("Disconnected");
  const [response, setResponse] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const svcRef = useRef<VoiceService | null>(null);

  useEffect(() => {
    const svc = new VoiceService();
    svcRef.current = svc;

    svc.connect(setResponse, setStatus ,setSessionReady ).catch((err) => {
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
    sessionReady,
    startRecording: () => svcRef.current?.startRecording(setStatus),
    stopRecording: () => svcRef.current?.stopRecording(setStatus),
    leaveSession: () => svcRef.current?.leaveSession()
  };
}
