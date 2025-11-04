"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createProgram, resizeCanvasToDisplaySize, setQuad } from "./gl";

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uAmp;
uniform vec3 uBaseColor;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod((x * 34.0 + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g, l.zxy);
  vec3 i2 = max(g, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0)
  ) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  vec4 j = p - 49.0 * floor(p / 49.0);

  vec4 x_ = floor(j / 7.0);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
  vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 g0 = vec3(a0.xy, h.x);
  vec3 g1 = vec3(a0.zw, h.y);
  vec3 g2 = vec3(a1.xy, h.z);
  vec3 g3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
  g0 *= norm.x;
  g1 *= norm.y;
  g2 *= norm.z;
  g3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  vec4 m2 = m * m;
  vec4 m4 = m2 * m2;

  vec4 gx = vec4(dot(g0, x0), dot(g1, x1), dot(g2, x2), dot(g3, x3));
  return 42.0 * dot(m4, gx);
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat3 rot = mat3(
    0.00, 0.80, 0.60,
    -0.80, 0.36, -0.48,
    -0.60, -0.48, 0.64
  );
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p);
    p = rot * p * 1.7;
    amplitude *= 0.5;
  }
  return value * 0.5 + 0.5;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
  float r = length(uv);
  float mask = smoothstep(1.02, 0.98, r);

  float amp = clamp(uAmp, 0.0, 1.0);
  float speed = mix(0.5, 1.45, amp);
  float warpA = mix(0.28, 0.48, amp);
  float warpB = mix(0.12, 0.32, amp);

  float t = uTime * speed;
  vec3 baseP = vec3(uv * (1.3 + amp * 0.6), t);
  vec2 w1 = vec2(
    fbm(vec3(baseP.xy * 1.1, t)),
    fbm(vec3(baseP.xy * 1.1 + 5.2, -t))
  );
  vec2 w2 = vec2(
    fbm(vec3(baseP.xy * 2.4 + 2.7, t * 0.6)),
    fbm(vec3(baseP.xy * 2.4 - 3.7, -t * 0.8))
  );

  vec2 uvd = uv + warpA * w1 + warpB * w2;

  float fil = abs(
    fbm(vec3(uvd * 1.8, t)) - fbm(vec3(uvd * 2.6 + 7.3, -t))
  );
  fil = smoothstep(0.35, 0.85, fil);
  float filament = pow(fil, 3.0);

  float flow = fbm(vec3(uvd * 1.35 + 4.2, t * 0.65));

  vec3 base = uBaseColor;
  vec3 deep = base * 0.12;
  vec3 mid = base * 0.6;
  vec3 hot = base * 2.0;

  vec3 col = mix(deep, mid, flow) + hot * filament * mix(0.7, 1.15, amp);
  col *= (1.0 - 0.35 * r);

  float rim = smoothstep(0.78, 0.98, r);
  col += hot * pow(1.0 - rim, 2.0) * 0.8;
  col *= mask;

  float aura = smoothstep(1.35, 0.9, r);
  vec3 auraColor = hot * 0.18 * aura * mix(0.5, 1.1, amp);

  float brightness = mix(0.82, 1.3, amp);
  vec3 color = col * brightness + auraColor * (1.0 - mask);
  float alpha = mask + aura * (1.0 - mask) * 0.75;

  fragColor = vec4(color, alpha);
}
`;

type VoiceOrbProps = {
  size: number;
  color: string;
  sensitivity?: number;
  amp?: number;
};

function hexToRgb(hex: string): [number, number, number] {
  let sanitized = hex.trim();
  if (sanitized.startsWith("#")) {
    sanitized = sanitized.slice(1);
  }
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const intVal = parseInt(sanitized, 16);
  const r = (intVal >> 16) & 255;
  const g = (intVal >> 8) & 255;
  const b = intVal & 255;
  return [r / 255, g / 255, b / 255];
}

export function VoiceOrb({
  size,
  color,
  sensitivity = 1.0,
  amp = 0,
}: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ampRef = useRef(0);
  const ampTargetRef = useRef(0);
  const [webglOk, setWebglOk] = useState(true);

  const baseColor = useMemo(() => hexToRgb(color), [color]);
  const scaledAmp = Math.min(1, Math.max(0, amp * sensitivity));

  useEffect(() => {
    ampTargetRef.current = scaledAmp;
  }, [scaledAmp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      setWebglOk(false);
      return;
    }

    let program: WebGLProgram | null = null;
    let vao: WebGLVertexArrayObject | null = null;
    let buffer: WebGLBuffer | null = null;
    let frameId: number | undefined;

    try {
      program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
      const quad = setQuad(gl);
      vao = quad.vao;
      buffer = quad.buffer;
    } catch (err) {
      console.error(err);
      setWebglOk(false);
      if (program) {
        gl.deleteProgram(program);
      }
      return;
    }

    const resolutionLoc = gl.getUniformLocation(program, "uResolution");
    const timeLoc = gl.getUniformLocation(program, "uTime");
    const ampLoc = gl.getUniformLocation(program, "uAmp");
    const baseColorLoc = gl.getUniformLocation(program, "uBaseColor");

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    const start = performance.now();

    const render = (now: number) => {
      const elapsed = (now - start) * 0.001;
      const dpr = window.devicePixelRatio || 1;
      const resized = resizeCanvasToDisplaySize(canvas, dpr);
      if (resized) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.clearColor(0.043, 0.043, 0.043, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const currentAmp = ampRef.current + (ampTargetRef.current - ampRef.current) * 0.12;
      ampRef.current = currentAmp;

      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform1f(ampLoc, currentAmp);
      gl.uniform3f(baseColorLoc, baseColor[0], baseColor[1], baseColor[2]);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      gl.bindVertexArray(null);
      gl.useProgram(null);
      if (vao) {
        gl.deleteVertexArray(vao);
      }
      if (buffer) {
        gl.deleteBuffer(buffer);
      }
      if (program) {
        gl.deleteProgram(program);
      }
    };
  }, [baseColor]);

  const displayScale = 1 + scaledAmp * 0.03;

  if (!webglOk) {
    return (
      <div
        ref={containerRef}
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          transform: `scale(${displayScale.toFixed(3)})`,
          background:
            "radial-gradient(circle at 50% 35%, rgba(212,20,20,0.75), rgba(212,20,20,0.15) 60%, rgba(212,20,20,0.05) 100%)",
          boxShadow: "0 0 90px rgba(212,20,20,0.25)",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center rounded-full drop-shadow-[0_0_24px_rgba(212,20,20,0.4)]"
      style={{
        width: size,
        height: size,
        transform: `scale(${displayScale.toFixed(3)})`,
        transition: "transform 120ms ease-out",
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
