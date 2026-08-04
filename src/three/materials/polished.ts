/**
 * A polished solid — the extruded vel mark on its dark stage.
 *
 * Half-lambert body, Blinn specular, fresnel edge, and one key light that
 * sweeps along the local Y axis (the mark's spine) on a uniform. Deliberately
 * not MeshPhysicalMaterial: no lights, no env map, no HDR download, and the
 * sweep is a single float rather than an animated light rig.
 */

import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDirW;
  varying float vSpine;

  uniform vec2 uSpineRange;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDirW = normalize(cameraPosition - worldPosition.xyz);
    vSpine = (position.y - uSpineRange.x) / max(uSpineRange.y - uSpineRange.x, 1e-4);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSpecularColor;
  uniform vec3 uRimColor;
  uniform vec3 uKeyDirection;
  uniform float uAmbient;
  uniform float uShininess;
  uniform float uSweep;      // -1 off, else 0..1 along the spine
  uniform float uSweepGain;
  uniform float uOpacity;

  varying vec3 vNormalW;
  varying vec3 vViewDirW;
  varying float vSpine;

  void main() {
    vec3 N = normalize(vNormalW);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(vViewDirW);
    vec3 L = normalize(uKeyDirection);
    vec3 H = normalize(L + V);

    float ndl = clamp((dot(N, L) + 0.42) / 1.42, 0.0, 1.0);
    float spec = pow(max(dot(N, H), 0.0), uShininess);
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

    vec3 color = uColor * (uAmbient + ndl * 0.95);
    color += uSpecularColor * spec * 0.55;
    color += uRimColor * fresnel * 0.35;

    if (uSweep >= 0.0) {
      float band = 1.0 - smoothstep(0.0, 0.22, abs(vSpine - uSweep));
      color += uSpecularColor * band * uSweepGain * (0.35 + 0.65 * spec);
    }

    gl_FragColor = vec4(color, uOpacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export interface PolishedOptions {
  color: string;
  specularColor?: string;
  rimColor?: string;
  shininess?: number;
  ambient?: number;
  spineRange?: THREE.Vector2;
}

export class PolishedMaterial extends THREE.ShaderMaterial {
  constructor(options: PolishedOptions) {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uColor: { value: new THREE.Color(options.color) },
        uSpecularColor: {
          value: new THREE.Color(options.specularColor ?? "#F8CE5A"),
        },
        uRimColor: { value: new THREE.Color(options.rimColor ?? "#F5A623") },
        uKeyDirection: {
          value: new THREE.Vector3(-0.4, 0.65, 0.65).normalize(),
        },
        uAmbient: { value: options.ambient ?? 0.24 },
        uShininess: { value: options.shininess ?? 64 },
        uSweep: { value: -1 },
        uSweepGain: { value: 0.9 },
        uOpacity: { value: 1 },
        uSpineRange: { value: options.spineRange ?? new THREE.Vector2(-1, 1) },
      },
    });
  }
}
