"use client";

import React, { useEffect, useRef } from "react";

type VoiceOrbProps = {
  isRecording: boolean;
  onToggle: () => void;
  size?: number; // px
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ورودی: دو رنگ هگز بدون #
// خروجی: rgba string
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

export default function VoiceOrb({ isRecording, onToggle, size = 144 }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // رنگ‌های پایه
  const blue = "#3b82f6";    // blue-500
  const emerald = "#10b981"; // برای recording سبز (در صورت نیاز)
  const purple = "#8b5cf6";  // بنفش (violet-ish)
  const magenta = "#d946ef"; // بنفش روشن‌تر برای هایلایت

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

      // میزان ترنزیشن بین آبی و بنفش (0..1). وقتی recording، بیشتر به سمت بنفش میره
      const colorT = isRecording ? (0.6 + 0.4 * (0.5 + 0.5 * Math.sin(elapsed * 1.8))) : 0.15;

      // رنگ‌های پویا
      const coreColor = mixHex(blue, purple, colorT, 0.95);     // هسته
      const edgeColor = mixHex(blue, magenta, colorT, 0.95);   // لبه
      const rippleColor = mixHex(blue, purple, colorT, 1);     // موج‌ها (alpha دستوری داریم پایین)
      const glowColor = mixHex(blue, purple, colorT, 0.9);

      ctx.clearRect(0, 0, size, size);

      // background glow (هسته‌ی بزرگ)
      const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
     size * 0.9,
     centerX, 
     centerY,
      size * 0.6
    );
      // برای هسته از coreColor با alpha بیشتر استفاده می‌کنیم
      gradient.addColorStop(0, coreColor);
      gradient.addColorStop(0.4,
         mixHex(blue, purple, colorT, 0.75));
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // living edge wobble
      const baseRadius = size * 0.36;
      const wobbleAmp = isRecording ? size * 0.02 : size * 0.015;
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

      // stroke با ترکیب بنفش و آبی، و کمی highlight از magenta
      ctx.lineWidth = isRecording ? 3 : 2;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = isRecording ? 18 : 10;
      // use a two-layer stroke: inner bright, outer dim
      ctx.strokeStyle = mixHex(blue, magenta, colorT, 0.95);
      ctx.stroke();

      // inner thin bright stroke
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const noise =
          Math.sin(theta * 3 + elapsed * wobbleSpeed) * 0.45 +
          Math.sin(theta * 5 - elapsed * wobbleSpeed * 0.65) * 0.45;
        const r = baseRadius - 4 + noise * (wobbleAmp * 0.6);
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = mixHex(magenta, blue, colorT, 0.95);
      ctx.lineWidth = 2.8;
      ctx.stroke();

      ctx.restore();

      
      const rippleCount = 2;
      for (let i = 0; i < rippleCount; i++) {
        const phase = (elapsed * (isRecording ? 0.4 : 0.6) + i * 0.22) % 1;
        const r = baseRadius + phase * size * (isRecording ? 0.22 : 0.16);
       const alpha = 1 - phase;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = mixHex(blue, purple, colorT, alpha * (isRecording ? 0.9 : 0.6));
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      
      // subtle purple overlay (soft film) for extra tint
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = mixHex(purple, magenta, colorT, isRecording ? 0.0 : 0.04);
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.44, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

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
        isRecording ? "focus-visible:ring-violet-400" : "focus-visible:ring-blue-400"
      }`}
      style={{ width: size, height: size }}
    >
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          isRecording ? "bg-violet-500/10" : "bg-gradient-to-br from-blue-900/10 to-violet-900/10"
        }`}
      />
      <canvas ref={canvasRef} className="relative rounded-full" />
 
    </button>
  );
}
