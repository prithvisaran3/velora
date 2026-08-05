"use client";

/**
 * 03 · The cone wall.
 *
 * Every Erode weaving shed has a wall of thread cones. It is the most
 * recognisable object in the trade after the loom, and it makes a colour
 * filter feel like a place instead of a control.
 *
 * Seven instanced cones, one material, vertex-coloured — the cheapest 3D on
 * the site. There is no texture to fetch and no geometry to load: one cone is
 * built in code and drawn seven times, so this scene adds nothing to the
 * network and cannot delay a product image.
 *
 * The CSS cones underneath are the poster and they are what a `low` device,
 * a reduced-motion visitor and a no-JS visitor see. This only ever replaces
 * them in place.
 */

import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CONE_COLOURS } from "./camera";

const COUNT = CONE_COLOURS.length;
/** World-space gap between cone centres. */
const SPACING = 1.28;
const BOB_AMPLITUDE = 0.075;

export interface ConeWallSceneProps {
  /** Index of the cone under the cursor, or -1. Driven by the DOM row. */
  hovered?: number;
}

export const ConeWallScene: React.FC<ConeWallSceneProps> = ({ hovered = -1 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  /** Per-cone spin and lift, eased toward their targets every frame. */
  const state = useRef(CONE_COLOURS.map(() => ({ spin: 0, lift: 0 })));

  const geometry = useMemo(() => new THREE.ConeGeometry(0.42, 1.22, 28, 1, true), []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.62,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    []
  );

  useLayoutEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    const colour = new THREE.Color();
    CONE_COLOURS.forEach((cone, i) => {
      instanced.setColorAt(i, colour.set(cone.hex));
    });
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    const instanced = mesh.current;
    if (!instanced) return;

    const time = performance.now() / 1000;
    const offset = ((COUNT - 1) * SPACING) / 2;
    // Frame-rate normalised so the ease is the same at 30fps and 120fps.
    const ease = 1 - Math.pow(0.001, delta);

    for (let i = 0; i < COUNT; i += 1) {
      const cone = state.current[i];
      const isHovered = i === hovered;

      // Hover spins the cone, the way you turn one to read its colour. It
      // keeps whatever angle it reached rather than snapping back.
      if (isHovered) cone.spin += delta * 1.6;
      cone.lift += ((isHovered ? 0.22 : 0) - cone.lift) * ease;

      dummy.position.set(
        i * SPACING - offset,
        // The shelf breathes: 5s cycles, staggered 0.4s apart, as in the poster.
        Math.sin(time * 1.256 + i * 0.5) * BOB_AMPLITUDE + cone.lift - 0.15,
        0
      );
      dummy.rotation.set(0, cone.spin, 0);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[2.4, 3.2, 4]} intensity={1.35} />
      <directionalLight position={[-3, 1, 2]} intensity={0.35} color="#FFDD8E" />
      <instancedMesh
        ref={mesh}
        args={[geometry, material, COUNT]}
        frustumCulled={false}
      />
    </>
  );
};
