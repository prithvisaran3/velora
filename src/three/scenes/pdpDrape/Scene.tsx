"use client";

/**
 * 04 · PDP drape + macro loupe.
 *
 * Drag to orbit ±40° of azimuth and ±12° of polar, damped, no zoom — the
 * border has to stay legible at every angle, which is why the clamps are
 * tight. Hovering (or tap-and-hold on a phone) opens the loupe: a second
 * camera at a third of the field of view renders the same scene into a 512²
 * target, drawn back as a 250px circle with a 2px marigold edge that follows
 * the pointer 220ms behind.
 *
 * The flat-lay hero above this stays a plain <img>. This scene loads on
 * intersection and never delays it.
 */

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOUPE, ORBIT } from "@/lib/motion";
import { useSceneTrack } from "../../sceneContext";
import { SilkMaterial } from "../../materials/silk";
import { MatteMaterial } from "../../materials/matte";
import { createPalluStripMask } from "../../materials/zari";
import { DyeChannel } from "../../store/dye";
import { damp } from "../../ease";
import {
  createBlouseGeometry,
  createPalluGeometry,
  createSkirtGeometry,
  createStandGeometry,
} from "./form";
import { createLoupe } from "./loupe";
import { DRAPE_RADIUS, DRAPE_TARGET_Y } from "./camera";

const DEG = Math.PI / 180;
const AZIMUTH_LIMIT = ORBIT.azimuth * DEG;
const POLAR_LIMIT = ORBIT.polar * DEG;
/** ORBIT.damping is a per-60Hz-frame lerp; as a time constant that is ~200ms. */
const ORBIT_TAU = -16.667 / Math.log(1 - ORBIT.damping);
const HOLD_MS = 260;
const LENS_DISTANCE = 2;
const STAGE = new THREE.Color("#14110F");

export interface PdpDrapeSceneProps {
  hex: string;
}

export const PdpDrapeScene: React.FC<PdpDrapeSceneProps> = ({ hex }) => {
  const track = useSceneTrack();
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);

  const channel = useMemo(
    () => new DyeChannel(hex),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const zari = useMemo(() => {
    const texture = createPalluStripMask(1024);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  const geometries = useMemo(
    () => ({
      stand: createStandGeometry(),
      skirt: createSkirtGeometry(),
      pallu: createPalluGeometry(),
      blouse: createBlouseGeometry(),
    }),
    []
  );

  const materials = useMemo(
    () => ({
      stand: new MatteMaterial("#2E2823"),
      silk: new SilkMaterial({
        baseColor: hex,
        zariMask: zari,
        weaveFrequency: 64,
        ambient: 0.24,
        // Weft runs along the cloth's width, which is v here — so +Y.
        tangentAxis: new THREE.Vector3(0, 1, 0),
      }),
      // A contrast blouse, the way it is actually stitched: the saree hue
      // taken down, plain weave, no zari.
      blouse: new SilkMaterial({
        baseColor: hex,
        weaveFrequency: 90,
        sheenGain: 0.55,
        ambient: 0.2,
        tangentAxis: new THREE.Vector3(0, 1, 0),
        side: THREE.FrontSide,
      }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zari]
  );

  const loupe = useMemo(createLoupe, []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const contrast = useMemo(() => new THREE.Color(), []);
  const clothRef = useRef<THREE.Group>(null);

  const state = useRef({
    azimuth: 0,
    polar: 0,
    azimuthTarget: 0,
    polarTarget: 0,
    pointerX: 0,
    pointerY: 0,
    lensX: 0,
    lensY: 0,
    lensOpacity: 0,
    dragging: false,
    lensActive: false,
    lastX: 0,
    lastY: 0,
    last: 0,
  });

  // The lens rides on the camera, so it stays screen-aligned however the
  // drape turns. The camera has to be in the graph for its child to render.
  useEffect(() => {
    camera.add(loupe.mesh);
    scene.add(camera);
    return () => {
      camera.remove(loupe.mesh);
      scene.remove(camera);
    };
  }, [camera, scene, loupe]);

  useEffect(() => {
    channel.set(hex);
  }, [channel, hex]);

  // Prime the blouse: the dye tick only fires while a hue is in motion.
  useEffect(() => {
    materials.blouse.setDye(
      contrast.copy(channel.colour()).multiplyScalar(0.62)
    );
  }, [materials, contrast, channel]);

  useEffect(
    () => () => {
      loupe.dispose();
      zari.dispose();
      materials.silk.dispose();
      materials.blouse.dispose();
      materials.stand.dispose();
      geometries.stand.dispose();
      geometries.skirt.dispose();
      geometries.pallu.dispose();
      geometries.blouse.dispose();
    },
    [loupe, zari, materials, geometries]
  );

  // Interaction is read off the tracking box; the canvas takes no events.
  useEffect(() => {
    const el = track?.current;
    if (!el) return;
    const s = state.current;
    let holdTimer: ReturnType<typeof setTimeout> | null = null;

    const toLocal = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      s.pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      s.pointerY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onDown = (event: PointerEvent) => {
      toLocal(event);
      s.dragging = true;
      s.lastX = event.clientX;
      s.lastY = event.clientY;
      el.setPointerCapture(event.pointerId);
      if (event.pointerType !== "mouse") {
        // Tap and hold opens the loupe on a phone.
        holdTimer = setTimeout(() => {
          s.lensActive = true;
          s.dragging = false;
        }, HOLD_MS);
      }
    };

    const onMove = (event: PointerEvent) => {
      toLocal(event);
      if (s.dragging) {
        const dx = event.clientX - s.lastX;
        const dy = event.clientY - s.lastY;
        s.lastX = event.clientX;
        s.lastY = event.clientY;
        if (holdTimer && Math.hypot(dx, dy) > 3) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
        s.azimuthTarget = THREE.MathUtils.clamp(
          s.azimuthTarget - dx * 0.006,
          -AZIMUTH_LIMIT,
          AZIMUTH_LIMIT
        );
        s.polarTarget = THREE.MathUtils.clamp(
          s.polarTarget + dy * 0.004,
          -POLAR_LIMIT,
          POLAR_LIMIT
        );
      } else if (event.pointerType === "mouse") {
        s.lensActive = true;
      }
    };

    const onUp = (event: PointerEvent) => {
      s.dragging = false;
      if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      if (event.pointerType !== "mouse") s.lensActive = false;
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
    };

    const onLeave = () => {
      s.dragging = false;
      s.lensActive = false;
    };

    el.style.pointerEvents = "auto";
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
      if (holdTimer) clearTimeout(holdTimer);
    };
  }, [track]);

  useFrame(() => {
    const s = state.current;
    const now = performance.now();
    const delta = s.last === 0 ? 16.7 : Math.min(now - s.last, 50);
    s.last = now;

    if (channel.tick(now)) {
      materials.silk.setDye(channel.colour());
      materials.blouse.setDye(contrast.copy(channel.colour()).multiplyScalar(0.62));
    }

    s.azimuth = damp(s.azimuth, s.azimuthTarget, ORBIT_TAU, delta);
    s.polar = damp(s.polar, s.polarTarget, ORBIT_TAU, delta);

    const cosPolar = Math.cos(s.polar);
    camera.position.set(
      Math.sin(s.azimuth) * cosPolar * DRAPE_RADIUS,
      DRAPE_TARGET_Y + Math.sin(s.polar) * DRAPE_RADIUS,
      Math.cos(s.azimuth) * cosPolar * DRAPE_RADIUS
    );
    camera.lookAt(0, DRAPE_TARGET_Y, 0);
    camera.updateMatrixWorld();

    // 220ms of follow lag is what makes the lens feel like glass and not a
    // cursor decoration.
    s.lensX = damp(s.lensX, s.pointerX, LOUPE.lagMs, delta);
    s.lensY = damp(s.lensY, s.pointerY, LOUPE.lagMs, delta);

    const cloth = clothRef.current;
    let hit: THREE.Vector3 | null = null;
    if (s.lensActive && cloth) {
      raycaster.setFromCamera(ndc.set(s.lensX, s.lensY), camera);
      const hits = raycaster.intersectObject(cloth, true);
      if (hits.length > 0) hit = hits[0].point;
    }

    s.lensOpacity = damp(s.lensOpacity, hit ? 1 : 0, 120, delta);
    loupe.material.uniforms.uOpacity.value = s.lensOpacity;
    loupe.mesh.visible = s.lensOpacity > 0.02;

    if (hit && loupe.mesh.visible) {
      loupe.camera.position.copy(camera.position);
      loupe.camera.fov = camera.fov * LOUPE.fovScale;
      loupe.camera.aspect = camera.aspect;
      loupe.camera.lookAt(hit);
      loupe.camera.updateProjectionMatrix();

      // Render the macro pass with the lens itself hidden, or it photographs
      // its own back.
      loupe.mesh.visible = false;
      const previousTarget = gl.getRenderTarget();
      const previousScissor = gl.getScissorTest();
      gl.setScissorTest(false);
      gl.setRenderTarget(loupe.target);
      gl.setClearColor(STAGE, 1);
      gl.clear(true, true, true);
      gl.render(scene, loupe.camera);
      gl.setRenderTarget(previousTarget);
      gl.setClearColor(0x000000, 0);
      gl.setScissorTest(previousScissor);
      loupe.mesh.visible = true;

      const viewHeight =
        2 * LENS_DISTANCE * Math.tan((camera.fov * DEG) / 2);
      const viewWidth = viewHeight * camera.aspect;
      const worldPerPixel = viewHeight / Math.max(size.height, 1);
      const lensSize = LOUPE.size * worldPerPixel;

      loupe.mesh.scale.set(lensSize, lensSize, 1);
      loupe.mesh.position.set(
        (s.lensX * viewWidth) / 2,
        (s.lensY * viewHeight) / 2,
        -LENS_DISTANCE
      );
    }
  }, 0);

  return (
    <group>
      <mesh geometry={geometries.stand} material={materials.stand} />
      <mesh geometry={geometries.blouse} material={materials.blouse} />
      <group ref={clothRef}>
        <mesh geometry={geometries.skirt} material={materials.silk} />
        <mesh geometry={geometries.pallu} material={materials.silk} />
      </group>
    </group>
  );
};
