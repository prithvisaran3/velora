"use client";

/**
 * 01 · The vel loader.
 *
 * Extruded mark on a dark stage. 0–260 it turns 0.6 of a revolution while one
 * key light sweeps the spine; 260–420 it settles flat as the camera flattens
 * to a near-orthographic lockup; 420–520 it holds. The saffron fabric wipe
 * (DOM, 520–780) and the reveal (780–900) belong to the poster layer above.
 *
 * 900ms is a hard cap and it is enforced by the clock, not by frame count —
 * a slow device shows less of the turn, never a longer loader.
 */

import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOADER } from "@/lib/motion";
import { beat, clamp01 } from "../../ease";
import { PolishedMaterial } from "../../materials/polished";
import { createVelGeometry } from "./geometry";
import {
  LOADER_FOV_FLAT as FOV_FLAT,
  LOADER_FOV_START as FOV_START,
  LOADER_Z_FLAT as Z_FLAT,
  LOADER_Z_START as Z_START,
} from "./camera";

const TURN = 0.6 * Math.PI * 2;

interface VelLoaderSceneProps {
  onFirstFrame: () => void;
}

export const VelLoaderScene: React.FC<VelLoaderSceneProps> = ({ onFirstFrame }) => {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(createVelGeometry, []);
  const materials = useMemo(() => {
    const blade = new PolishedMaterial({
      color: "#E8621B",
      specularColor: "#F8CE5A",
      rimColor: "#F5A623",
      shininess: 58,
      ambient: 0.22,
    });
    const spine = new PolishedMaterial({
      color: "#F5A623",
      specularColor: "#F8CE5A",
      rimColor: "#F8CE5A",
      shininess: 120,
      ambient: 0.3,
      spineRange: new THREE.Vector2(-0.32, 0.88),
    });
    const collar = new PolishedMaterial({
      color: "#F5A623",
      specularColor: "#F8CE5A",
      rimColor: "#F8CE5A",
      shininess: 120,
      ambient: 0.3,
    });
    return { blade, spine, collar };
  }, []);

  const started = useRef(0);
  const frames = useRef(0);

  useFrame(() => {
    if (started.current === 0) started.current = performance.now();
    const elapsed = performance.now() - started.current;

    frames.current += 1;
    if (frames.current === 2) onFirstFrame();

    const node = group.current;
    if (!node) return;

    // 0–260 · the turn, ending exactly flat.
    const turn = beat(elapsed, LOADER.drawStart, LOADER.drawEnd);
    node.rotation.y = -TURN * (1 - turn);

    // 260–420 · settle: the residual tilt goes, the camera flattens.
    const settle = beat(elapsed, LOADER.drawEnd, LOADER.closeEnd);
    node.rotation.x = 0.16 * (1 - settle);
    node.rotation.z = 0.04 * (1 - settle);

    camera.fov = FOV_START + (FOV_FLAT - FOV_START) * settle;
    camera.position.z = Z_START + (Z_FLAT - Z_START) * settle;
    camera.updateProjectionMatrix();

    // The specular sweep rides the spine through the turn, then parks.
    const sweep = clamp01(elapsed / LOADER.drawEnd);
    materials.spine.uniforms.uSweep.value = sweep < 1 ? sweep : -1;
    materials.blade.uniforms.uSweep.value = sweep < 1 ? sweep * 0.9 : -1;

    const fade = clamp01(elapsed / 110);
    materials.blade.uniforms.uOpacity.value = fade;
    materials.spine.uniforms.uOpacity.value = fade;
    materials.collar.uniforms.uOpacity.value = fade;
  }, 0);

  return (
    <group ref={group}>
      <mesh geometry={geometry.blade} material={materials.blade} />
      <mesh geometry={geometry.spine} material={materials.spine} />
      <mesh geometry={geometry.collar} material={materials.collar} />
    </group>
  );
};
