/**
 * The drape form itself — matte, unlit, and deliberately unmemorable. It is a
 * stand for the cloth, so it gets a half-lambert body and a faint rim and
 * nothing else.
 */

import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDirW;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDirW = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uRimColor;
  uniform vec3 uKeyDirection;
  uniform float uAmbient;

  varying vec3 vNormalW;
  varying vec3 vViewDirW;

  void main() {
    vec3 N = normalize(vNormalW);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(vViewDirW);
    float ndl = clamp((dot(N, normalize(uKeyDirection)) + 0.5) / 1.5, 0.0, 1.0);
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.6);

    vec3 color = uColor * (uAmbient + ndl * 0.8) + uRimColor * fresnel * 0.18;
    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export class MatteMaterial extends THREE.ShaderMaterial {
  constructor(color = "#2E2823", rimColor = "#F5A623") {
    super({
      vertexShader,
      fragmentShader,
      side: THREE.FrontSide,
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uRimColor: { value: new THREE.Color(rimColor) },
        uKeyDirection: { value: new THREE.Vector3(-0.4, 0.75, 0.52).normalize() },
        uAmbient: { value: 0.22 },
      },
    });
  }
}
