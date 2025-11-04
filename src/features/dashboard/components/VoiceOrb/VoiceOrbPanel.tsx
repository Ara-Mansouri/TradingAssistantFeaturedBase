"use client";

import React, { useState } from 'react';
import VoiceOrb from './VoiceOrb';

type VoiceOrbPanelProps = {
	initialListening?: boolean;
	orbSizeClass?: string; // e.g., "w-48 h-48"
	color?: string;
	sensitivity?: number;
};

export const VoiceOrbPanel: React.FC<VoiceOrbPanelProps> = ({
	initialListening = false,
	orbSizeClass = "w-48 h-48",
	color = '#D41414',
	sensitivity = 1.0,
}) => {
	const [listening, setListening] = useState(initialListening);

	return (
		<div className="flex flex-col items-center justify-center gap-4 p-4">
			<VoiceOrb
				listening={listening}
				className={["", orbSizeClass].join(' ')}
				color={color}
				sensitivity={sensitivity}
				backgroundAlpha={0}
			/>
			<button
				onClick={() => setListening(v => !v)}
				className="px-5 py-2 rounded-full text-white bg-gradient-to-r from-[#8A0E0E] to-[#D41414] shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
			>
				{listening ? 'Stop Listening' : 'Start Listening'}
			</button>
			<p className="text-sm text-neutral-300">Tap to toggle mic reactivity</p>
		</div>
	);
};

export default VoiceOrbPanel;




