import { useEffect, useState } from "react";

export function useMicVolume(isRecording: boolean) {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!isRecording) {
      setVolume(0);
      return;
    }

    let ctx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let raf: number;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);

      analyser = ctx.createAnalyser();
      analyser.fftSize = 256; //

      const data = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser);

      const tick = () => {
        analyser!.getByteTimeDomainData(data);

        let max = 0;
        for (let i = 0; i < data.length; i++) {
          const v = Math.abs((data[i] - 128) / 128);
          if (v > max) max = v;
        }

        setVolume(max);

        raf = requestAnimationFrame(tick);
      };

      tick();
    });

    return () => {
      if (ctx) ctx.close();
      cancelAnimationFrame(raf);
    };
  }, [isRecording]);

  return volume; 
}
