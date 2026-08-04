"use client";

/**
 * 02 · Hero cloth — a saree that actually falls.
 *
 * A 6×4 plane under the verlet solver, wearing the anisotropic silk shader:
 * the sheen runs across the weft and slides as the cloth turns, and the zari
 * takes a far tighter specular so the border reads sharper than the ground.
 * It drops from 1.2 units above frame on mount, settles in ~1.4s, then breathes
 * with the pointer — move left and the lower-left fall lifts, no more than
 * 0.15 units, smoothed over 400ms.
 *
 * The grid halves on `mid` (24 → 12) and the solver is frame-rate normalised,
 * so the settle takes 1.4s on every device that renders it at all.
 */

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CLOTH } from "@/lib/motion";
import { useSceneTrack } from "../../sceneContext";
import { SilkMaterial } from "../../materials/silk";
import { createZariMask } from "../../materials/zari";
import { DyeChannel } from "../../store/dye";
import { ClothSolver } from "./cloth";

const DEFAULT_SIZE: readonly [number, number] = [6, 4];
const ORIGIN: readonly [number, number, number] = [0, 0, 0];

export interface HeroClothSceneProps {
  /** The hue this cloth wears. The hero stays kora; /colour dyes it. */
  hex: string;
  /** Halve the grid on `mid`. */
  halfGrid?: boolean;
  /** Cloth footprint in world units. */
  size?: readonly [number, number];
  tilt?: number;
  /** Light hues need a calmer band or the silk reads as blown-out paper. */
  sheenGain?: number;
  /** Where the cloth hangs — the hero shifts it clear of the headline. */
  position?: readonly [number, number, number];
}

export const HeroClothScene: React.FC<HeroClothSceneProps> = ({
  hex,
  halfGrid = false,
  size = DEFAULT_SIZE,
  tilt = -0.06,
  sheenGain,
  position = ORIGIN,
}) => {
  const track = useSceneTrack();

  // Moment 03. The channel is created once and never again: on
  // /colour/[slug] this component stays mounted through every navigation, so
  // changing hue re-tints *this* mesh instead of building a new one.
  const channel = useMemo(
    () => new DyeChannel(hex),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const solver = useMemo(
    () =>
      new ClothSolver({
        width: size[0],
        height: size[1],
        segments: halfGrid ? CLOTH.segments / 2 : CLOTH.segments,
      }),
    [halfGrid, size]
  );

  const zari = useMemo(
    () => createZariMask({ border: 0.075, pallu: 0.2, buttaRows: 8, buttaColumns: 5 }),
    []
  );

  const material = useMemo(
    () =>
      new SilkMaterial({
        baseColor: channel.hex(),
        zariMask: zari,
        weaveFrequency: 52,
        sheenGain,
        ambient: 0.26,
        // The weft runs across the width of the cloth: object-space +X.
        tangentAxis: new THREE.Vector3(1, 0, 0),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channel, zari]
  );

  // Pointer influence is read from the tracking box, not from the canvas.
  useEffect(() => {
    const el = track?.current;
    if (!el) return;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      solver.setPointer(x, y);
    };
    const onLeave = () => solver.releasePointer();

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [track, solver]);

  useEffect(() => {
    channel.set(hex);
  }, [channel, hex]);

  useEffect(
    () => () => {
      solver.dispose();
      material.dispose();
      zari.dispose();
    },
    [solver, material, zari]
  );

  const last = useRef(0);

  useFrame(() => {
    const now = performance.now();
    const delta = last.current === 0 ? 16.7 : now - last.current;
    last.current = now;

    solver.step(delta);
    if (channel.tick(now)) material.setDye(channel.colour());
  }, 0);

  return (
    <mesh
      geometry={solver.geometry}
      material={material}
      rotation={[0, 0, tilt]}
      position={[position[0], position[1], position[2]]}
    />
  );
};
