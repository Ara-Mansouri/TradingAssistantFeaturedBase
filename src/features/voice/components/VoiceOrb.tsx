"use client";

import React, { useEffect, useRef } from "react";

type VoiceOrbProps = {
  isRecording: boolean;
  onToggle: () => void;
  size?: number; // px
};


export default function VoiceOrb({ isRecording, onToggle, size = 250 }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;

    const draw = (t: number) => {
      if (!running) return;
      if (!startTimeRef.current) startTimeRef.current = t;
      const elapsed = (t - startTimeRef.current) / 1000; // seconds

      ctx.clearRect(0, 0, size, size);

      // 🌈 Background glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        4,
        centerX,
        centerY,
        size * 0.6
      );
      gradient.addColorStop(
        0,
        isRecording ? "rgba(16,185,129,0.9)" : "rgba(59,130,246,0.85)"
      ); // emerald-500 / blue-500
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 🌊 Living edge wobble
      const baseRadius = size * 0.36;
      const wobbleAmp = isRecording ? size * 0.03 : size * 0.015;
      const wobbleSpeed = isRecording ? 5.2 : 4.2;
      const segments = 90;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const noise =
          Math.sin(theta * 3 + elapsed * wobbleSpeed) * 0.5 +
          Math.sin(theta * 5 - elapsed * wobbleSpeed * 0.7) * 0.5;
        const r = baseRadius + noise * wobbleAmp;
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = isRecording
        ? "rgba(16,185,129,0.9)"
        : "rgba(59,130,246,0.9)";
      ctx.lineWidth = 2;
      ctx.shadowColor = isRecording
        ? "rgba(16,185,129,0.45)"
        : "rgba(59,130,246,0.45)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // 🔵 Concentric ripples
      const rippleCount = 3;
      for (let i = 0; i < rippleCount; i++) {
        const phase = (elapsed * (isRecording ? 1.8 : 0.6) + i * 0.22) % 1;
        const r = baseRadius + phase * size * (isRecording ? 0.22 : 0.16);
        const alpha = 1 - phase;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = isRecording
          ? `rgba(16,185,129,${0.35 * alpha})`
          : `rgba(59,130,246,${0.28 * alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRecording, size]);

  return (
    <button
      aria-pressed={isRecording}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      onClick={onToggle}
      className={`group relative inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        isRecording
          ? "focus-visible:ring-emerald-400"
          : "focus-visible:ring-blue-400"
      }`}
      style={{ width: size, height: size }}
    >
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          isRecording ? "bg-emerald-500/20" : "bg-blue-500/20"
        }`}
      />
      <canvas ref={canvasRef} className="relative rounded-full" />
      {/* 🔴 Small status dot */}
      {/* <span
        className={`pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full shadow-md transition-colors ${
          isRecording
            ? "bg-emerald-400 shadow-emerald-400/40"
            : "bg-blue-400 shadow-blue-400/40"
        }`}
      /> */}
    </button>
  );
}
