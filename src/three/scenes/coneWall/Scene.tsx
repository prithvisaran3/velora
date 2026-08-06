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

import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CONE_COLOURS } from "./camera";
import { THREAD_GOLD } from "@/view/thread/palette";

const COUNT = CONE_COLOURS.length;
const BOB_AMPLITUDE = 0.075;

/**
 * The shelf's geometry, in world units.
 *
 * Defaults only apply if the poster row cannot be measured — normally ConeWall
 * derives these from the CSS cones themselves, so the two shelves are the same
 * size in the same places and a cone always sits above its own label.
 */
export interface ConeLayout {
  radius: number;
  height: number;
  spacing: number;
  centreY: number;
}

const DEFAULT_LAYOUT: ConeLayout = {
  radius: 0.42,
  height: 1.22,
  spacing: 1.28,
  centreY: -0.15,
};

export interface ConeWallSceneProps {
  /** Index of the cone under the cursor, or -1. Driven by the DOM row. */
  hovered?: number;
  /**
   * Fired once, from inside the render loop, after the shelf has actually put
   * a frame on screen. "The canvas exists" is not the same claim: if this
   * scene's chunk fails, the tier demotes, or the mesh never gets a frame,
   * nothing calls this and the CSS poster stays up. An empty box is the one
   * outcome the wall is not allowed to have.
   */
  onPainted?: () => void;
  /** Measured from the poster row. Omit and the scene falls back to defaults. */
  layout?: ConeLayout;
}

export const ConeWallScene: React.FC<ConeWallSceneProps> = ({
  hovered = -1,
  onPainted,
  layout = DEFAULT_LAYOUT,
}) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const announced = useRef(false);
  /** Per-cone spin and lift, eased toward their targets every frame. */
  const state = useRef(CONE_COLOURS.map(() => ({ spin: 0, lift: 0 })));

  const geometry = useMemo(
    () => new THREE.ConeGeometry(layout.radius, layout.height, 28, 1, true),
    [layout.radius, layout.height]
  );

  // A new cone replaces the old one, so the old one's buffers go back.
  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        // NOT vertexColors. An InstancedMesh takes its per-cone hue from
        // `instanceColor` (USE_INSTANCING_COLOR), which three wires up on its
        // own. Asking for vertexColors as well defines USE_COLOR, and the
        // shader then multiplies by a per-vertex `color` attribute ConeGeometry
        // does not have — it reads as (0,0,0) and every cone renders black.
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
    const offset = ((COUNT - 1) * layout.spacing) / 2;
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
        i * layout.spacing - offset,
        // The shelf breathes: 5s cycles, staggered 0.4s apart, as in the poster.
        Math.sin(time * 1.256 + i * 0.5) * BOB_AMPLITUDE + cone.lift + layout.centreY,
        0
      );
      dummy.rotation.set(0, cone.spin, 0);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    }
    instanced.instanceMatrix.needsUpdate = true;

    // The shelf is on screen. Only now may the poster stand down.
    if (!announced.current) {
      announced.current = true;
      onPainted?.();
    }
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[2.4, 3.2, 4]} intensity={1.35} />
      {/* Warm fill, sourced from the palette rather than a stray hex. */}
      <directionalLight position={[-3, 1, 2]} intensity={0.35} color={THREAD_GOLD.lit} />
      <instancedMesh
        ref={mesh}
        args={[geometry, material, COUNT]}
        frustumCulled={false}
      />
    </>
  );
};
