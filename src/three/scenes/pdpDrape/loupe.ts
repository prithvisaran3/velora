/**
 * The macro loupe lens.
 *
 * A quad parented to the view camera, textured with a 512² render target that
 * holds the same scene shot through a camera at one third the field of view.
 * Real thread detail at 3×, not a scaled bitmap. 250px across with a 2px
 * marigold edge, exactly as specified.
 */

import * as THREE from "three";
import { LOUPE } from "@/lib/motion";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uEdgeColor;
  uniform float uEdgeWidth;   // as a fraction of the radius
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    if (d > 1.0) discard;

    vec3 color = texture2D(uMap, vUv).rgb;
    float edge = smoothstep(1.0 - uEdgeWidth - 0.006, 1.0 - uEdgeWidth, d);
    color = mix(color, uEdgeColor, edge);

    gl_FragColor = vec4(color, uOpacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export interface Loupe {
  mesh: THREE.Mesh;
  target: THREE.WebGLRenderTarget;
  camera: THREE.PerspectiveCamera;
  material: THREE.ShaderMaterial;
  dispose(): void;
}

export function createLoupe(): Loupe {
  const target = new THREE.WebGLRenderTarget(LOUPE.targetPx, LOUPE.targetPx, {
    depthBuffer: true,
    samples: 0,
  });
  target.texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uMap: { value: target.texture },
      uEdgeColor: { value: new THREE.Color("#F5A623") },
      // 2px of a 125px radius.
      uEdgeWidth: { value: LOUPE.edgePx / (LOUPE.size / 2) },
      uOpacity: { value: 0 },
    },
  });

  const geometry = new THREE.PlaneGeometry(1, 1);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 999;
  mesh.frustumCulled = false;
  mesh.visible = false;

  const camera = new THREE.PerspectiveCamera(12, 1, 0.05, 60);

  return {
    mesh,
    target,
    camera,
    material,
    dispose() {
      geometry.dispose();
      material.dispose();
      target.dispose();
    },
  };
}
