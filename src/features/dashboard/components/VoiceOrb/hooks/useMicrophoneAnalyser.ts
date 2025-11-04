import { useEffect, useRef, useState } from 'react';

type UseMicrophoneAnalyserOptions = {
	fftSize?: number;
	smoothingTimeConstant?: number;
	enabled?: boolean;
};

export function useMicrophoneAnalyser(options: UseMicrophoneAnalyserOptions = {}) {
	const { fftSize = 1024, smoothingTimeConstant = 0.85, enabled = true } = options;
	const analyserRef = useRef<AnalyserNode | null>(null);
	const dataArrayRef = useRef<Uint8Array | null>(null);
	const frameRef = useRef<number | null>(null);
	const [amplitude, setAmplitude] = useState(0);
	const [ready, setReady] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let audioContext: AudioContext | null = null;
		let mediaStream: MediaStream | null = null;

		async function setup() {
			if (!enabled) return;
			try {
				mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
				audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
				const source = audioContext.createMediaStreamSource(mediaStream);
				const analyser = audioContext.createAnalyser();
				analyser.fftSize = fftSize;
				analyser.smoothingTimeConstant = smoothingTimeConstant;
				source.connect(analyser);
				analyserRef.current = analyser;
				dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
				setReady(true);

				const loop = () => {
					if (!analyserRef.current || !dataArrayRef.current) return;
					analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);
					const arr = dataArrayRef.current;
					let sum = 0;
					for (let i = 0; i < arr.length; i++) {
						const weight = 1 - i / arr.length;
						sum += arr[i] * weight;
					}
					const avg = sum / arr.length / 255;
					setAmplitude(avg);
					frameRef.current = requestAnimationFrame(loop);
				};
				frameRef.current = requestAnimationFrame(loop);
			} catch (e: any) {
				setError(e?.message || 'Microphone access failed');
			}
		}

		setup();

		return () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
			if (analyserRef.current) analyserRef.current.disconnect();
			if (audioContext) audioContext.close();
			if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
			analyserRef.current = null;
			dataArrayRef.current = null;
			setReady(false);
		};
	}, [enabled, fftSize, smoothingTimeConstant]);

	return { amplitude, ready, error };
}




