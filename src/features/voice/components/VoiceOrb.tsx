"use client";

import React, { useEffect, useRef } from "react";

type VoiceOrbProps = {
  isRecording: boolean;
  onToggle: () => void;
  size?: number; // px
  volume?: number; 
  disabled: boolean;

};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixHex(hexA: string, hexB: string, t: number, alpha = 1) {
  const a = hexA.replace("#", "");
  const b = hexB.replace("#", "");
  const ar = parseInt(a.slice(0, 2), 16);
  const ag = parseInt(a.slice(2, 4), 16);
  const ab = parseInt(a.slice(4, 6), 16);
  const br = parseInt(b.slice(0, 2), 16);
  const bg = parseInt(b.slice(2, 4), 16);
  const bb = parseInt(b.slice(4, 6), 16);
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const bcol = Math.round(lerp(ab, bb, t));
  return `rgba(${r},${g},${bcol},${alpha})`;
}

export default function VoiceOrb({ isRecording, onToggle, size = 144 ,  volume = 0 , disabled = true}: VoiceOrbProps) 
{
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pulse = 1 + volume * 0.6;
  const scale = Math.min(pulse, 1.1);

  //  رنگ‌ها
  const blue = "#2563eb";      // آبی اصلی
  const indigo = "#4338ca";    // آبی تیره / نیلی
  const violet = "#7c3aed";    // بنفش نئونی
  const neonBlue = "#38bdf8";  // آبی درخشان
  const activeAccent = "#a855f7"; // بنفش روشن‌تر (درخشان)

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
      const elapsed = (t - startTimeRef.current) / 1000;
      ctx.clearRect(0, 0, size, size);

      // تغییر رنگ پویا با تمرکز بر بنفش
      const colorT = isRecording
        ? 0.7 + 0.3 * Math.sin(elapsed * 1.5)
        : 0.4 + 0.2 * Math.sin(elapsed * 0.8);

      // رنگ‌های ترکیبی
      const baseColor = mixHex(violet, blue, colorT, 0.9);
      const glowColor = mixHex(violet, neonBlue, colorT, 0.8);
      const edgeColor = mixHex(violet, activeAccent, colorT, 1);
      const rippleColor = mixHex(violet, indigo, colorT, 1);

      //  پس‌زمینه ملایم بنفش
      const gradient = ctx.createRadialGradient(centerX, centerY, size * 0.25, centerX, centerY, size * 0.7);
      gradient.addColorStop(0, mixHex(violet, indigo, colorT, 0.08));
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const micPulse = volume * size * 0.1; // مقدار پالس با صدا
      //  لبه زنده

      const dynamicRadius = size * 0.36 + micPulse * 0.5;
      const baseRadius = Math.min(dynamicRadius, size *0.5);
      const wobbleAmp = (isRecording ? size * 0.035 : size * 0.025)+ micPulse * 0.3;
      const wobbleSpeed = isRecording ? 3.6 : 2.5;
      const segments = 100;

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

      //  Outer bright ring
      ctx.lineWidth = isRecording ? 3 : 2;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = isRecording ? 25 : 15;
      ctx.strokeStyle = mixHex(violet, neonBlue, colorT, 0.95);
      ctx.stroke();

      //  Inner stroke (soft violet core)
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const noise =
          Math.sin(theta * 4 + elapsed * wobbleSpeed) * 0.5 +
          Math.sin(theta * 6 - elapsed * wobbleSpeed * 0.5) * 0.5;
        const r = baseRadius - 3 + noise * (wobbleAmp * 0.6);
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = mixHex(activeAccent, neonBlue, colorT, 0.8);
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.restore();

      // موج‌های هم‌مرکز
      // const rippleCount = 3;
      // for (let i = 0; i < rippleCount; i++) {
      //   const phase = (elapsed * (isRecording ? 0.25 : 0.3) + i * 0.25) % 1;
      //   const r = baseRadius + phase * size * (isRecording ? 0.22 : 0.16);
      //   const alpha = 1 - phase;
      //   ctx.beginPath();
      //   ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      //   ctx.strokeStyle = mixHex(violet, indigo, colorT, alpha * (isRecording ? 0.8 : 0.4));
      //   ctx.lineWidth = 1.1;
      //   ctx.stroke();
      // }

      //  Outer ring glow (لبه‌ی روشن و نئونی)
      ctx.save();
      const ring = ctx.createRadialGradient(centerX, centerY, size * 0.38, centerX, centerY, size * 0.48);
      ring.addColorStop(0, "rgba(0,0,0,0)");
      ring.addColorStop(0.7, mixHex(violet, neonBlue, colorT, 0.4));
      ring.addColorStop(1, mixHex(neonBlue, violet, colorT, 0.95));
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.46, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRecording, size, volume]);

  return (
    <button
      aria-pressed={isRecording}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
      onClick={disabled ? undefined : onToggle}
      
      className={`group relative inline-flex items-center justify-center rounded-full 
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black
        ${isRecording ? "focus-visible:ring-violet-400" : "focus-visible:ring-blue-400"}`}
      style={{ width: size, height: size , opacity: disabled ? 0.4 : 1,}}
    >
      
      {/* <div
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          isRecording
            ? "bg-gradient-to-br from-violet-800/20 to-indigo-800/10"
            : "bg-gradient-to-br from-indigo-900/20 to-violet-900/10"
        }`}
      /> */}

      
   <canvas
  ref={canvasRef}
  className="relative rounded-full"
  style={{
    transform: `scale(${scale})`,
    transition: "transform 0.05s linear",
  }}
/>
    </button>
  );
}
