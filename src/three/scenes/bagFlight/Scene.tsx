"use client";

/**
 * 06 · Add to bag — the cloth folds and flies.
 *
 * An orthographic overlay whose units are CSS pixels, so the plane starts at
 * exactly the measured rect of the product image and arcs along a quadratic
 * to the bag over 720ms, folding on two axes as it goes: the right half turns
 * back about the vertical centre line, then the bottom half about the
 * horizontal one. It is the same silk shader as the hero, so the fold catches
 * the same sheen.
 */

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DURATION } from "@/lib/motion";
import { SilkMaterial } from "../../materials/silk";
import { createZariMask } from "../../materials/zari";
import { clamp01, easeSilk } from "../../ease";
import type { FlightRequest } from "../../store/flight";

const FLIGHT_MS = DURATION.flight * 1000;
/**
 * The longest edge the flying cloth may start at. FLIP anchors it to the
 * measured rect, but a PDP flat-lay is 840px wide and a plane that size fills
 * the screen — it reads as a wall falling over, not as a saree being folded.
 * Capping keeps the anchor and the gesture both.
 */
const MAX_START_PX = 300;

const displacement = /* glsl */ `
  uniform float uFold;

  void veloraDisplace(inout vec3 pos, inout vec3 nrm, vec2 uvCoord) {
    vec3 p = pos;
    vec3 n = vec3(0.0, 0.0, 1.0);
    float a = uFold * 1.85;

    // Fold one: the right half turns back about the vertical centre line.
    if (p.x > 0.0) {
      float c = cos(a);
      float s = sin(a);
      p = vec3(p.x * c, p.y, p.z - p.x * s);
      n = vec3(s, 0.0, c);
    }

    // Fold two: the bottom half follows, about the horizontal one.
    if (p.y < 0.0) {
      float b = a * 0.86;
      float c = cos(b);
      float s = sin(b);
      p = vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
      n = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c);
    }

    pos = p;
    nrm = normalize(n);
  }
`;

export interface BagFlightSceneProps {
  request: FlightRequest;
  onDone: () => void;
}

export const BagFlightScene: React.FC<BagFlightSceneProps> = ({
  request,
  onDone,
}) => {
  const size = useThree((state) => state.size);
  const mesh = useRef<THREE.Mesh>(null);

  const zari = useMemo(
    () =>
      createZariMask({
        border: 0.06,
        pallu: 0.14,
        buttaRows: 4,
        buttaColumns: 3,
        size: 256,
      }),
    []
  );

  const uniforms = useMemo(() => ({ uFold: { value: 0 } }), []);

  const material = useMemo(
    () =>
      new SilkMaterial({
        baseColor: request.hex,
        zariMask: zari,
        weaveFrequency: 30,
        sheenGain: 0.6,
        ambient: 0.26,
        transparent: true,
        displacement: { glsl: displacement, uniforms },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zari, uniforms]
  );

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 20, 20), []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      zari.dispose();
    },
    [geometry, material, zari]
  );

  const started = useRef(0);
  const finished = useRef(false);

  const start = useMemo(() => {
    const longest = Math.max(request.from.width, request.from.height, 1);
    const fit = Math.min(1, MAX_START_PX / longest);
    return { width: request.from.width * fit, height: request.from.height * fit };
  }, [request]);

  useFrame(() => {
    const node = mesh.current;
    if (!node) return;
    if (started.current === 0) started.current = performance.now();

    const raw = clamp01((performance.now() - started.current) / FLIGHT_MS);

    // Travel gets a symmetric smoothstep, not the brand curve. EASE_SILK is a
    // reveal easing — on a 720ms arc it covers 87% of the distance in the first
    // 180ms, so the flight reads as a snap and the fold never lands. Duration
    // and the no-bounce rule are unchanged; only the arc's parameterisation is.
    const t = raw * raw * (3 - 2 * raw);

    // Pixel space, origin at the centre of the viewport.
    const halfW = size.width / 2;
    const halfH = size.height / 2;
    const fromX = request.from.x - halfW;
    const fromY = halfH - request.from.y;
    const toX = request.to.x - halfW;
    const toY = halfH - request.to.y;

    // One control point, lifted above the chord — cloth is thrown, not slid.
    const controlX = (fromX + toX) / 2;
    const controlY = Math.max(fromY, toY) + Math.abs(toX - fromX) * 0.3 + 90;

    const inv = 1 - t;
    node.position.set(
      inv * inv * fromX + 2 * inv * t * controlX + t * t * toX,
      inv * inv * fromY + 2 * inv * t * controlY + t * t * toY,
      0
    );

    const scale = 1 - 0.72 * easeSilk(raw);
    node.scale.set(start.width * scale, start.height * scale, 1);
    node.rotation.z = -0.42 * t;

    // Folded by 45% of the way, so the cloth arrives at the bag already folded.
    uniforms.uFold.value = easeSilk(clamp01(raw / 0.45));
    material.uniforms.uOpacity.value = 1 - clamp01((raw - 0.72) / 0.28);

    if (raw >= 1 && !finished.current) {
      finished.current = true;
      onDone();
    }
  }, 0);

  return <mesh ref={mesh} geometry={geometry} material={material} />;
};
