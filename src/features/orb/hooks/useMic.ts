"use client";

import { useEffect, useRef, useState } from "react";

type MicOptions = {
  fftSize?: number;
  smoothingTimeConstant?: number;
  enabled: boolean;
};

type MicState = {
  amp: number;
  ready: boolean;
  error: string | null;
};

export function useMic({
  fftSize = 1024,
  smoothingTimeConstant = 0.85,
  enabled,
}: MicOptions): MicState {
  const [amp, setAmp] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!enabled) {
      setAmp(0);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {
          /* noop */
        });
        audioContextRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setReady(false);
      return;
    }

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Microphone not supported in this environment");
      setReady(false);
      setAmp(0);
      return;
    }

    let cancelled = false;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = smoothingTimeConstant;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyserRef.current = analyser;
        audioContextRef.current = audioContext;
        mediaStreamRef.current = stream;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        setReady(true);
        setError(null);

        const update = () => {
          if (!analyserRef.current || !dataArrayRef.current) {
            setAmp(0);
            return;
          }
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          let weighted = 0;
          let weightSum = 0;
          dataArrayRef.current.forEach((value, index) => {
            const weight = 1 + index * 0.35;
            weighted += (value / 255) * weight;
            weightSum += weight;
          });
          const avg = weightSum > 0 ? weighted / weightSum : 0;
          setAmp(Math.min(1, Math.max(0, avg)));
          rafRef.current = requestAnimationFrame(update);
        };

        update();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Microphone error";
        setError(message);
        setReady(false);
        setAmp(0);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {
          /* noop */
        });
        audioContextRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [enabled, fftSize, smoothingTimeConstant]);

  return { amp, ready, error };
}
