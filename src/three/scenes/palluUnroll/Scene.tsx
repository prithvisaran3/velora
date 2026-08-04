"use client";

/**
 * 05 · The pallu unroll.
 *
 * One plane, one uniform. `uUnroll` moves the point where the cloth leaves the
 * cylinder; everything before it lies flat facing the viewer, everything after
 * it wraps on an Archimedean spiral whose radius tightens as it goes, so the
 * roll visibly thins as it gives up cloth. Normals are analytic — a finite
 * difference on a 240-segment strip would band under the sheen.
 *
 * Desktop `high` only, and dynamically imported: nothing here is downloaded on
 * a phone.
 */

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SilkMaterial } from "../../materials/silk";
import { createPalluStripMask } from "../../materials/zari";
import { getUnrollProgress } from "../../store/unroll";
import { damp } from "../../ease";

const LENGTH = 6.6;
const WIDTH = 1.55;
const RADIUS = 0.44;
/** How much the spiral tightens per radian — the roll thins as it opens. */
const TIGHTEN = 0.03;

const displacement = /* glsl */ `
  uniform float uUnroll;
  uniform float uLength;
  uniform float uWidth;
  uniform float uRadius;
  uniform float uTighten;

  void veloraDisplace(inout vec3 pos, inout vec3 nrm, vec2 uvCoord) {
    float s = uvCoord.x * uLength;
    float openLength = uUnroll * uLength;
    float x0 = -uLength * 0.5;

    vec2 plane;      // (x, z)
    vec2 tangent;

    if (s <= openLength) {
      plane = vec2(x0 + s, 0.0);
      tangent = vec2(1.0, 0.0);
    } else {
      float a = (s - openLength) / uRadius;
      float r = max(uRadius - uTighten * a, 0.045);
      vec2 centre = vec2(x0 + openLength, uRadius);
      plane = centre + vec2(r * sin(a), -r * cos(a));
      tangent = vec2(cos(a), sin(a));
    }

    // Keep the open cloth centred as the roll travels right.
    float shift = -openLength * 0.5 + uRadius * 0.5;

    pos = vec3(plane.x + shift, (uvCoord.y - 0.5) * uWidth, plane.y);
    nrm = normalize(vec3(-tangent.y, 0.0, tangent.x));
  }
`;

export interface PalluUnrollSceneProps {
  hex: string;
}

export const PalluUnrollScene: React.FC<PalluUnrollSceneProps> = ({ hex }) => {
  const zari = useMemo(() => createPalluStripMask(1024), []);

  const uniforms = useMemo(
    () => ({
      uUnroll: { value: 0 },
      uLength: { value: LENGTH },
      uWidth: { value: WIDTH },
      uRadius: { value: RADIUS },
      uTighten: { value: TIGHTEN },
    }),
    []
  );

  const material = useMemo(
    () =>
      new SilkMaterial({
        baseColor: hex,
        zariMask: zari,
        weaveFrequency: 58,
        ambient: 0.2,
        // Weft runs across the strip's width: object-space +Y.
        tangentAxis: new THREE.Vector3(0, 1, 0),
        displacement: { glsl: displacement, uniforms },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zari, uniforms]
  );

  // The plane is a UV carrier only — every position comes from the shader.
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 260, 6), []);

  useEffect(() => {
    material.setDye(new THREE.Color(hex));
  }, [material, hex]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      zari.dispose();
    },
    [geometry, material, zari]
  );

  const last = useRef(0);

  useFrame(() => {
    const now = performance.now();
    const delta = last.current === 0 ? 16.7 : Math.min(now - last.current, 50);
    last.current = now;
    // A little smoothing on top of ScrollTrigger's scrub keeps a trackpad
    // flick from snapping the roll open.
    uniforms.uUnroll.value = damp(
      uniforms.uUnroll.value,
      getUnrollProgress(),
      90,
      delta
    );
  }, 0);

  return <mesh geometry={geometry} material={material} />;
};
