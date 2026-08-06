/**
 * Silk — anisotropic sheen across the weft, zari sharper than the ground.
 *
 * Kajiya–Kay strand specular oriented along the weft tangent is what makes
 * silk read as silk: the highlight is a band that runs *across* the cloth and
 * slides as the surface turns, rather than a round blob. Zari threads take a
 * far tighter exponent (metalness 1 / roughness .18 in spec terms) plus their
 * own gold tint, so they stay legible against every saree hue.
 *
 * Written as a ShaderMaterial rather than MeshPhysicalMaterial on purpose: no
 * lights in any scene, no env map download, ~4 KB of GLSL, and the dye lerp is
 * two uniform writes instead of a material rebuild.
 */

import * as THREE from "three";
import { SILK } from "@/lib/motion";
import { blankMask } from "./zari";
import { THREAD_GOLD } from "@/view/thread/palette";

/**
 * `displacement` lets a scene rewrite the vertex before lighting — the pallu
 * unroll bends the plane round its cylinder here rather than forking the whole
 * material. The snippet must define:
 *   void veloraDisplace(inout vec3 pos, inout vec3 nrm, vec2 uv)
 */
const vertexShader = (displacement?: string) => /* glsl */ `
  uniform vec3 uTangentAxis;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vTangentW;
  varying vec3 vViewDirW;

  ${displacement ?? ""}

  void main() {
    vUv = uv;

    vec3 displaced = position;
    vec3 shaped = normal;
    ${displacement ? "veloraDisplace(displaced, shaped, uv);" : ""}

    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * shaped);

    // The weft direction, projected onto the surface so it stays tangent
    // however far the cloth has deformed.
    vec3 axis = normalize(mat3(modelMatrix) * uTangentAxis);
    vec3 t = axis - n * dot(n, axis);
    vTangentW = length(t) > 1e-4 ? normalize(t) : vec3(1.0, 0.0, 0.0);

    vNormalW = n;
    vViewDirW = normalize(cameraPosition - worldPosition.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBaseColor;
  uniform vec3 uSheenColor;
  uniform vec3 uZariColor;
  uniform vec3 uRimColor;
  uniform vec3 uKeyDirection;
  uniform vec3 uFillDirection;
  uniform float uAmbient;
  uniform float uSheenRoughness;
  uniform float uWeaveFrequency;
  uniform float uSheenGain;
  uniform float uZariAmount;
  uniform float uOpacity;
  uniform float uSweep;          // 0..1 specular sweep position, -1 disables
  uniform sampler2D uZariMask;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vTangentW;
  varying vec3 vViewDirW;

  // Kajiya–Kay: the specular band lies perpendicular to the thread tangent.
  float strandSpecular(vec3 tangent, vec3 halfway, float exponent) {
    float dotTH = dot(tangent, halfway);
    float sinTH = sqrt(max(1e-4, 1.0 - dotTH * dotTH));
    return pow(sinTH, exponent);
  }

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(vViewDirW);
    if (!gl_FrontFacing) N = -N;

    // Weave micro-relief. Warp and weft are out of phase, which breaks the
    // sheen into individual threads instead of one plastic sweep.
    float warp = sin(vUv.x * uWeaveFrequency * 6.28318);
    float weft = sin(vUv.y * uWeaveFrequency * 1.62 * 6.28318);
    float threads = 0.945 + 0.055 * warp * weft;

    vec3 T = normalize(vTangentW + N * warp * 0.055);

    vec3 L = normalize(uKeyDirection);
    vec3 H = normalize(L + V);
    float ndl = dot(N, L);
    // Silk keeps light well past the terminator — a hard lambert reads as paper.
    float wrapped = clamp((ndl + 0.38) / 1.38, 0.0, 1.0);

    vec3 F = normalize(uFillDirection);
    float fill = clamp((dot(N, F) + 0.6) / 1.6, 0.0, 1.0) * 0.26;

    // Normalised against the ambient floor: the lit term can reach the base
    // colour but never exceed it, so kora silk stays cloth instead of blowing
    // out to paper the moment the key catches it.
    float lit = clamp(wrapped * 0.88 + fill, 0.0, 1.0);
    vec3 ground = uBaseColor * threads * (uAmbient + (1.0 - uAmbient) * lit);

    float sheenExponent = mix(240.0, 16.0, clamp(uSheenRoughness, 0.0, 1.0));
    float sheen = strandSpecular(T, H, sheenExponent) * (0.34 + 0.66 * wrapped);
    ground += uSheenColor * sheen * uSheenGain;

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.4);
    ground += uRimColor * fresnel * 0.3;

    // Zari: half-fine gold, drawn from the mask, always the same gold whatever
    // the cloth has been dyed. That is what sells dye as dye.
    float zari = texture2D(uZariMask, vUv).r * uZariAmount;
    if (zari > 0.001) {
      float glint = 0.72 + 0.28 * sin(vUv.y * uWeaveFrequency * 3.1 * 6.28318);
      vec3 metalDiffuse = uZariColor * (0.22 + 0.78 * wrapped) * glint;
      vec3 metalSpec = uZariColor * strandSpecular(T, H, 640.0) * 1.5;
      vec3 metal = metalDiffuse + metalSpec + uRimColor * fresnel * 0.5;
      ground = mix(ground, metal, zari);
    }

    // One key light sweeping along the mark's spine (loader only).
    if (uSweep >= 0.0) {
      float band = 1.0 - smoothstep(0.0, 0.16, abs(vUv.y - uSweep));
      ground += uSheenColor * band * 0.5;
    }

    gl_FragColor = vec4(ground, uOpacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export interface SilkUniforms {
  uBaseColor: { value: THREE.Color };
  uSheenColor: { value: THREE.Color };
  uZariColor: { value: THREE.Color };
  uRimColor: { value: THREE.Color };
  uKeyDirection: { value: THREE.Vector3 };
  uFillDirection: { value: THREE.Vector3 };
  uTangentAxis: { value: THREE.Vector3 };
  uAmbient: { value: number };
  uSheenRoughness: { value: number };
  uWeaveFrequency: { value: number };
  uSheenGain: { value: number };
  uZariAmount: { value: number };
  uOpacity: { value: number };
  uSweep: { value: number };
  uZariMask: { value: THREE.Texture };
  [uniform: string]: THREE.IUniform;
}

export interface SilkOptions {
  baseColor: string;
  /** Defaults to the base hue lightened by SILK.sheenLighten. */
  sheenColor?: string;
  zariMask?: THREE.Texture;
  zariAmount?: number;
  weaveFrequency?: number;
  /** How hard the anisotropic band reads. Light hues want less. */
  sheenGain?: number;
  ambient?: number;
  /** Object-space weft direction. Planes use +X; the pallu strip uses +Z. */
  tangentAxis?: THREE.Vector3;
  side?: THREE.Side;
  transparent?: boolean;
  /** GLSL defining `veloraDisplace`, plus the uniforms it reads. */
  displacement?: { glsl: string; uniforms: Record<string, THREE.IUniform> };
}

/**
 * The thread's current colour, as a THREE.Color.
 *
 * A shader uniform cannot read a CSS custom property, so this samples it once
 * at material construction. Falls back to gold when there is no document or
 * the property has not resolved — never to a hardcoded marigold that would
 * ignore the room.
 */
function liveThread(property: string, fallback: string): THREE.Color {
  if (typeof document === "undefined") return new THREE.Color(fallback);
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();
  try {
    return new THREE.Color(value || fallback);
  } catch {
    return new THREE.Color(fallback);
  }
}

/** sheenColor = the saree hue lightened by 18%, per docs/3D-MOTION.md §02. */
export function lightenedSheen(base: THREE.Color): THREE.Color {
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  const sheen = new THREE.Color();
  sheen.setHSL(
    hsl.h,
    Math.min(1, hsl.s * 0.92),
    Math.min(1, hsl.l + SILK.sheenLighten)
  );
  return sheen;
}

export class SilkMaterial extends THREE.ShaderMaterial {
  declare uniforms: SilkUniforms;

  constructor(options: SilkOptions) {
    const base = new THREE.Color(options.baseColor);
    const sheen = options.sheenColor
      ? new THREE.Color(options.sheenColor)
      : lightenedSheen(base);

    super({
      vertexShader: vertexShader(options.displacement?.glsl),
      fragmentShader,
      transparent: options.transparent ?? false,
      side: options.side ?? THREE.DoubleSide,
      uniforms: {
        ...(options.displacement?.uniforms ?? {}),
        uBaseColor: { value: base },
        uSheenColor: { value: sheen },
        // Zari is thread, so it takes the room's colour like every other
        // thread on the site. Read once at construction — a flight is built
        // when it is fired, by which point <html> already carries the hue of
        // the saree being bought.
        uZariColor: { value: liveThread("--thread", THREAD_GOLD.base) },
        uRimColor: { value: liveThread("--thread-lit", THREAD_GOLD.lit) },
        uKeyDirection: { value: new THREE.Vector3(-0.45, 0.72, 0.53).normalize() },
        uFillDirection: { value: new THREE.Vector3(0.8, -0.2, 0.56).normalize() },
        uTangentAxis: { value: options.tangentAxis ?? new THREE.Vector3(1, 0, 0) },
        uAmbient: { value: options.ambient ?? 0.2 },
        uSheenRoughness: { value: SILK.sheenRoughness },
        uWeaveFrequency: { value: options.weaveFrequency ?? 46 },
        uSheenGain: { value: options.sheenGain ?? 0.75 },
        uZariAmount: { value: options.zariAmount ?? (options.zariMask ? 1 : 0) },
        uOpacity: { value: 1 },
        uSweep: { value: -1 },
        uZariMask: { value: options.zariMask ?? blankMask() },
      } satisfies SilkUniforms,
    });
  }

  /** Dye: base and sheen move, zari never does. */
  setDye(base: THREE.Color): void {
    this.uniforms.uBaseColor.value.copy(base);
    this.uniforms.uSheenColor.value.copy(lightenedSheen(base));
  }
}
