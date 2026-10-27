import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

import { monogramStrokes } from "@/components/brand/monogram";

/*
 * The HD monogram as a field of particles. Points are sampled from the same
 * stroke paths the SVG mark uses, assemble from a scattered cloud when the
 * field starts, drift gently, part around the pointer and dissolve as the
 * hero scrolls away. Plain three.js keeps the bundle to what this one effect
 * needs; there is no React renderer in the loop.
 */

const SAMPLE_SIZE = 256;
const SAMPLE_STEP = 2.1;
const DUST_COUNT = 520;
const CAMERA_Z = 4;
const FOV = 35;
const INTRO_SECONDS = 2.4;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uScatter;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uMotion;
  uniform vec2 uPointer;
  uniform float uPointerStrength;

  attribute vec3 aSeed;
  attribute float aAccent;
  attribute float aDust;

  varying float vAccent;
  varying float vAlpha;

  float easeOutCubic(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
  }

  void main() {
    vec3 dir = normalize(aSeed - 0.5 + 1e-4);
    vec3 scattered = position + dir * (1.3 + aSeed.x * 1.8);
    float t = clamp(uIntro * 1.6 - aSeed.z * 0.6, 0.0, 1.0);
    vec3 p = mix(scattered, position, easeOutCubic(t));

    float phase = aSeed.x * 6.2831;
    float drift = 0.006 * uMotion * (1.0 + aDust * 7.0);
    p.x += sin(uTime * 0.7 + phase) * drift;
    p.y += cos(uTime * 0.6 + phase * 1.3) * drift;
    p.z += sin(uTime * 0.5 + phase * 0.7) * 0.04 * uMotion;

    vec2 away = p.xy - uPointer;
    float dist = length(away);
    // Per-particle reach and strength keep the parting edge ragged, not a clean circle.
    float reach = 0.32 + aSeed.y * 0.22;
    float push = smoothstep(reach, 0.0, dist) * uPointerStrength * (0.55 + aSeed.z * 0.75);
    p.xy += (away / max(dist, 1e-3)) * push * 0.2;
    p.z += push * 0.5;

    p += dir * uScatter * (0.9 + aSeed.y * 1.6);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    float size = uSize * (0.65 + aSeed.y * 0.7) * mix(1.0, 0.55, aDust);
    gl_PointSize = size * uPixelRatio * (${CAMERA_Z.toFixed(1)} / -mvPosition.z);

    vAccent = aAccent;
    vAlpha = mix(1.0, 0.4, aDust) * (1.0 - uScatter) * smoothstep(0.0, 0.35, t + aDust * 0.5);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;

  varying float vAccent;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.18, d) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(mix(uColor, uAccent, vAccent), alpha);
    #include <colorspace_fragment>
  }
`;

type Sample = { x: number; y: number; accent: boolean };

/** Rasterises the monogram strokes and returns points spread evenly over the ink. */
function sampleMonogram(): Sample[] {
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  const scale = SAMPLE_SIZE / 64;
  ctx.scale(scale, scale);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 5.5;
  // Plain strokes go in the red channel and the accent crossbar in green, so a
  // single read tells both apart.
  for (const stroke of monogramStrokes) {
    ctx.strokeStyle = stroke.accent ? "#00ff00" : "#ff0000";
    ctx.globalCompositeOperation = stroke.accent ? "source-over" : "lighter";
    ctx.stroke(new Path2D(stroke.d));
  }

  const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  const samples: Sample[] = [];
  for (let y = 0; y < SAMPLE_SIZE; y += SAMPLE_STEP) {
    for (let x = 0; x < SAMPLE_SIZE; x += SAMPLE_STEP) {
      const jx = x + (Math.random() - 0.5) * SAMPLE_STEP;
      const jy = y + (Math.random() - 0.5) * SAMPLE_STEP;
      const index = (Math.floor(jy) * SAMPLE_SIZE + Math.floor(jx)) * 4;
      if ((data[index + 3] ?? 0) < 128) continue;
      samples.push({
        // Centre the 64-unit artwork (its ink spans x 9..55, y 11..53) on the origin.
        x: (jx / scale - 32) / 24,
        y: -(jy / scale - 32) / 24,
        accent: (data[index + 1] ?? 0) > (data[index] ?? 0),
      });
    }
  }
  return samples;
}

export type MonogramFieldOptions = {
  color: string;
  accent: string;
  /** Static, fully formed mark with no drift, intro or pointer response. */
  reducedMotion: boolean;
};

export type MonogramField = {
  setColors: (color: string, accent: string) => void;
  /** 0 is the formed mark, 1 fully dissolved. */
  setScatter: (value: number) => void;
  setActive: (active: boolean) => void;
  dispose: () => void;
};

export function createMonogramField(
  canvas: HTMLCanvasElement,
  { color, accent, reducedMotion }: MonogramFieldOptions,
): MonogramField {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 20);
  camera.position.z = CAMERA_Z;

  const samples = sampleMonogram();
  const count = samples.length + DUST_COUNT;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 3);
  const accents = new Float32Array(count);
  const dust = new Float32Array(count);

  samples.forEach((sample, i) => {
    positions.set([sample.x, sample.y, (Math.random() - 0.5) * 0.08], i * 3);
    accents[i] = sample.accent ? 1 : 0;
  });
  for (let i = samples.length; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.9 + Math.random() * 1.1;
    positions.set(
      [Math.cos(angle) * radius * 1.2, Math.sin(angle) * radius, (Math.random() - 0.5) * 1.2],
      i * 3,
    );
    dust[i] = 1;
    accents[i] = Math.random() < 0.08 ? 1 : 0;
  }
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new Float32BufferAttribute(seeds, 3));
  geometry.setAttribute("aAccent", new Float32BufferAttribute(accents, 1));
  geometry.setAttribute("aDust", new Float32BufferAttribute(dust, 1));

  const uniforms = {
    uTime: { value: 0 },
    uIntro: { value: reducedMotion ? 1 : 0 },
    uScatter: { value: 0 },
    uSize: { value: 3.2 },
    uPixelRatio: { value: pixelRatio },
    uMotion: { value: reducedMotion ? 0 : 1 },
    uPointer: { value: [10, 10] as [number, number] },
    uPointerStrength: { value: 0 },
    uColor: { value: new Color(color) },
    uAccent: { value: new Color(accent) },
  };

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
  });

  const points = new Points(geometry, material);
  scene.add(points);

  let halfHeight = Math.tan(((FOV / 2) * Math.PI) / 180) * CAMERA_Z;
  let halfWidth = halfHeight;
  const resize = () => {
    const { clientWidth, clientHeight } = canvas;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    halfHeight = Math.tan(((FOV / 2) * Math.PI) / 180) * CAMERA_Z;
    halfWidth = halfHeight * camera.aspect;
    // Keep the mark a similar size in narrow frames.
    uniforms.uSize.value = 3.2 * Math.min(1, clientWidth / 520) + 1;
    render();
  };

  // Pointer target in world units, eased toward each frame.
  const target = { x: 10, y: 10, strength: 0, tiltX: 0, tiltY: 0 };
  const onPointerMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    target.x = nx * halfWidth;
    target.y = ny * halfHeight;
    const near = Math.abs(nx) < 1.3 && Math.abs(ny) < 1.3;
    target.strength = near ? 1 : 0;
    target.tiltX = Math.max(-1, Math.min(1, nx));
    target.tiltY = Math.max(-1, Math.min(1, ny));
  };
  const onPointerLeave = () => {
    target.strength = 0;
  };

  let active = false;
  let frame = 0;
  let last = performance.now();
  let introStart = -1;

  const render = () => renderer.render(scene, camera);

  const tick = (now: number) => {
    frame = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (introStart < 0) introStart = now;

    uniforms.uTime.value += dt;
    uniforms.uIntro.value = Math.min(1, (now - introStart) / 1000 / INTRO_SECONDS);

    const ease = 1 - Math.pow(0.001, dt);
    const pointer = uniforms.uPointer.value;
    pointer[0] += (target.x - pointer[0]) * ease;
    pointer[1] += (target.y - pointer[1]) * ease;
    uniforms.uPointerStrength.value += (target.strength - uniforms.uPointerStrength.value) * ease;
    points.rotation.y += (target.tiltX * 0.28 - points.rotation.y) * ease * 0.5;
    points.rotation.x += (-target.tiltY * 0.2 - points.rotation.x) * ease * 0.5;

    render();
    if (active) frame = requestAnimationFrame(tick);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  if (!reducedMotion) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
  }

  return {
    setColors(nextColor, nextAccent) {
      uniforms.uColor.value.set(nextColor);
      uniforms.uAccent.value.set(nextAccent);
      if (!active) render();
    },
    setScatter(value) {
      uniforms.uScatter.value = value;
      if (!active) render();
    },
    setActive(next) {
      if (reducedMotion) {
        render();
        return;
      }
      if (next === active) return;
      active = next;
      if (active && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    },
    dispose() {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
