"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  createProgram,
  createWebGL2Context,
  disposeGl,
  resizeCanvasToDisplaySize,
  setFullscreenQuad,
} from "./webgl/glUtils";
import { useMicrophoneAnalyser } from "./hooks/useMicrophoneAnalyser";

type VoiceOrbProps = {
  listening?: boolean;
  className?: string;
  sensitivity?: number;
  color?: string;
  backgroundAlpha?: number;
  seed?: number;
};

// ---------- Vertex Shader ----------
const VERT = `#version 300 es
layout(location=0) in vec2 aPos;
layout(location=1) in vec2 aUv;
out vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// ---------- Fragment Shader ----------
const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
in vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform float uAmp;
uniform vec3 uBaseColor;
uniform float uBgAlpha;
uniform float uSeed;

// ---------- noise ----------
float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1,0.2,0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (0.01 + uSeed));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f*f*(3.0-2.0*f);
  return mix(
    mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
        mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
        mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float a = 0.5;
  float v = 0.0;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.55;
  }
  return v;
}

// ---------- main ----------
void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  float r = length(uv);
  float t = uTime * 0.4;

  // Domain warping (creates that fluid swirl)
  vec3 p = vec3(uv * 2.0, t);
  p.xy += 0.4 * vec2(sin(t*0.5), cos(t*0.3));
  float f1 = fbm(p);
  float f2 = fbm(p + vec3(2.3, 1.7, -t*0.8));
  float swirl = smoothstep(0.3, 0.9, abs(f1 - f2));

  // plasma color layers
  vec3 deep = uBaseColor * 0.1;
  vec3 mid  = uBaseColor * 0.6;
  vec3 hot  = uBaseColor * 2.0;

  vec3 col = mix(deep, mid, swirl);
  col += hot * pow(swirl, 3.0);

  // center dark & rim bright
  float rim = smoothstep(0.8, 0.99, r);
  col *= 1.0 - r * 0.4;
  col += hot * pow(1.0 - rim, 2.0) * 0.8;

  // audio pulse
  col += uBaseColor * (uAmp * 0.3);

  // circular fade
  float alpha = smoothstep(1.05, 0.85, r);

  outColor = vec4(col, alpha);
}`;




function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const bigint = parseInt(m.length === 3 ? m.split("").map((c) => c + c).join("") : m, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255];
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  listening = false,
  className,
  sensitivity = 1.0,
  color = "#D41414",
  backgroundAlpha = 0.0,
  seed = 0.37,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vaoRef = useRef<WebGLVertexArrayObject | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const baseColor = useMemo(() => hexToRgb(color), [color]);
  const { amplitude } = useMicrophoneAnalyser({
    enabled: listening,
    smoothingTimeConstant: 0.9,
    fftSize: 1024,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = createWebGL2Context(canvas);
    if (!gl) return;
    glRef.current = gl;

    const program = createProgram(gl, VERT, FRAG);
    programRef.current = program;
    const { vao, buffer } = setFullscreenQuad(gl);
    vaoRef.current = vao;
    bufferRef.current = buffer;

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uAmp = gl.getUniformLocation(program, "uAmp");
    const uBaseColor = gl.getUniformLocation(program, "uBaseColor");
    const uBgAlpha = gl.getUniformLocation(program, "uBgAlpha");
    const uSeed = gl.getUniformLocation(program, "uSeed");

    gl.useProgram(program);
    gl.uniform3f(uBaseColor, baseColor[0], baseColor[1], baseColor[2]);
    gl.uniform1f(uBgAlpha, backgroundAlpha);
    gl.uniform1f(uSeed, seed);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    startTimeRef.current = performance.now();

    const render = () => {
      if (!glRef.current || !programRef.current) return;
      const gl = glRef.current;
      const program = programRef.current;

      const resized = resizeCanvasToDisplaySize(canvas);
      if (resized) gl.viewport(0, 0, canvas.width, canvas.height);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.bindVertexArray(vaoRef.current);

      const now = performance.now();
      const t = (now - startTimeRef.current) / 1000;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      const amp = Math.min(1, Math.max(0, amplitude * sensitivity));
      gl.uniform1f(uAmp, amp);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.bindVertexArray(null);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    const onResize = () => resizeCanvasToDisplaySize(canvas);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (glRef.current)
        disposeGl(glRef.current, {
          program: programRef.current,
          vao: vaoRef.current,
          buffer: bufferRef.current,
        });
      glRef.current = null;
      programRef.current = null;
      vaoRef.current = null;
      bufferRef.current = null;
    };
  }, [baseColor, backgroundAlpha, seed]);

  return (
    <div
      className={[
        "relative inline-block select-none",
        "[filter:_drop-shadow(0_0_25px_rgba(212,20,20,0.5))]",
        className || "w-40 h-40",
      ].join(" ")}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-full"
        style={{ display: "block" }}
      />
      {/* <div
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 rounded-full blur-2xl",
          "bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.45),rgba(0,0,0,0)_70%)]",
          listening ? "animate-pulse opacity-90" : "opacity-60",
        ].join(" ")}
      /> */}
    </div>
  );
};

export default VoiceOrb;
