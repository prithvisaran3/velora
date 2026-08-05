"use client";

/**
 * One WebGL context for the whole site.
 *
 * Fixed to the viewport, transparent, and never unmounted across routes.
 * Scenes are scissored into the screen rect of their tracking element, so a
 * view costs nothing while it is off screen and there is never a second
 * renderer. This module — and everything it reaches, including three itself —
 * is behind a dynamic import and is only fetched once LCP has happened.
 *
 * Paint order: the canvas sits at `--velora-canvas-z` (5), above page
 * backgrounds and below the sticky header (40) and modals (50). Anything that
 * must read over a scene declares `z-10`. Outside a view's rect the canvas is
 * cleared to full transparency every frame, so it is invisible.
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, createPortal, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FRAME_BUDGET_MS } from "@/lib/motion";
import { dprFor, runFrameProbe, type Tier } from "./tier";
import { useTunnelledScenes } from "./sceneTunnel";
import { SceneTrackProvider } from "./sceneContext";
import { disposeScene, getViews, registerView } from "./useScene";
import type { CameraSpec, SceneDescriptor } from "./types";

/* ------------------------------------------------------------------ */
/* Renderer — takes over the frame loop and scissors every view        */
/* ------------------------------------------------------------------ */

function ViewRenderer({ tier, active }: { tier: Tier; active: boolean }): null {
  const lastFrame = useRef(0);
  const parked = useRef(false);
  const budget = tier === "high" ? FRAME_BUDGET_MS.high : FRAME_BUDGET_MS.mid;

  // Priority 1 hands rendering to us: R3F stops auto-rendering, and every
  // scene's own priority-0 useFrame still runs first, in mount order.
  useFrame(({ gl, size }) => {
    if (typeof document !== "undefined" && document.hidden) return;

    // Parked (demoted to `low` mid-session): wipe the canvas once, then draw
    // nothing at all. The context stays, invisible and idle.
    if (!active) {
      if (!parked.current) {
        parked.current = true;
        gl.setScissorTest(false);
        gl.clear(true, true, true);
      }
      return;
    }
    parked.current = false;

    const now = performance.now();
    if (tier !== "high" && now - lastFrame.current < budget - 4) return;
    lastFrame.current = now;

    const canvasWidth = size.width;
    const canvasHeight = size.height;

    gl.setScissorTest(false);
    gl.clear(true, true, true);

    for (const view of getViews()) {
      if (view.enabled?.() === false) continue;

      const rect = view.el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;

      const clip = view.clipTop?.() ?? 0;
      const top = Math.max(rect.top, clip);
      const bottom = Math.min(rect.bottom, canvasHeight);
      const left = Math.max(rect.left, 0);
      const right = Math.min(rect.right, canvasWidth);
      if (bottom <= top || right <= left) continue;

      const width = right - left;
      const height = bottom - top;
      const camera = view.camera;

      // The camera always frames the *whole* tracked box; setViewOffset crops
      // to the visible slice, so clipping never squashes the scene.
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = rect.width / rect.height;
      } else {
        camera.left = -rect.width / 2;
        camera.right = rect.width / 2;
        camera.top = rect.height / 2;
        camera.bottom = -rect.height / 2;
      }
      camera.setViewOffset(
        rect.width,
        rect.height,
        left - rect.left,
        top - rect.top,
        width,
        height
      );
      camera.updateProjectionMatrix();

      gl.setViewport(left, canvasHeight - bottom, width, height);
      gl.setScissor(left, canvasHeight - bottom, width, height);
      gl.setScissorTest(true);
      gl.clear(false, true, false);
      gl.render(view.scene, camera);
    }

    gl.setScissorTest(false);
  }, 1);

  return null;
}

/* ------------------------------------------------------------------ */
/* One view: its own THREE.Scene, portalled inside the canvas          */
/* ------------------------------------------------------------------ */

function buildCamera(
  spec: CameraSpec
): THREE.PerspectiveCamera | THREE.OrthographicCamera {
  const near = spec.near ?? 0.1;
  const far = spec.far ?? 100;
  const camera =
    spec.kind === "orthographic"
      ? new THREE.OrthographicCamera(-1, 1, 1, -1, near, far)
      : new THREE.PerspectiveCamera(spec.fov ?? 32, 1, near, far);

  const [x, y, z] = spec.position ?? [0, 0, 6.4];
  camera.position.set(x, y, z);
  const [tx, ty, tz] = spec.target ?? [0, 0, 0];
  camera.lookAt(tx, ty, tz);
  return camera;
}

function PortalScene({
  track,
  order,
  camera: cameraSpec,
  clipTop,
  enabled,
  children,
}: Omit<SceneDescriptor, "id">) {
  const [scene] = useState(() => new THREE.Scene());
  const [camera] = useState(() => buildCamera(cameraSpec));
  const [size, setSize] = useState({ width: 1, height: 1, top: 0, left: 0 });

  // Held in refs so a fresh inline callback from the page cannot churn the
  // registry sixty times a second.
  const clipRef = useRef(clipTop);
  const enabledRef = useRef(enabled);
  clipRef.current = clipTop;
  enabledRef.current = enabled;

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const read = () => {
      const rect = el.getBoundingClientRect();
      setSize((prev) =>
        prev.width === rect.width && prev.height === rect.height
          ? prev
          : {
              width: rect.width,
              height: rect.height,
              top: rect.top,
              left: rect.left,
            }
      );
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, [track]);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    return registerView({
      el,
      scene,
      camera,
      order,
      clipTop: () => clipRef.current?.() ?? 0,
      enabled: () => enabledRef.current?.() ?? true,
    });
  }, [track, scene, camera, order]);

  // Geometries, materials, textures and render targets go back on unmount, so
  // twenty route changes leak nothing. The context itself is never recreated.
  useEffect(() => () => disposeScene(scene), [scene]);

  return createPortal(
    <SceneTrackProvider track={track}>{children}</SceneTrackProvider>,
    scene,
    { camera, size }
  );
}

function TunnelOutlet(): React.ReactElement {
  const scenes = useTunnelledScenes();
  return (
    <>
      {scenes.map(({ id, ...rest }) => (
        <PortalScene key={id} {...rest} />
      ))}
    </>
  );
}

/** Reports the first painted frame so posters know when to hand over. */
function ReadySignal({ onReady }: { onReady: (ready: boolean) => void }): null {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    gl.autoClear = false;
    gl.setClearColor(0x000000, 0);
    const raf = requestAnimationFrame(() => {
      onReady(true);
      runFrameProbe();
    });
    return () => {
      cancelAnimationFrame(raf);
      onReady(false);
    };
  }, [gl, onReady]);
  return null;
}

export interface ThreeRootProps {
  /** The tier the renderer was built for; never `low`. */
  tier: Exclude<Tier, "low">;
  /** False parks the context without unmounting it. */
  active: boolean;
  onReadyChange: (ready: boolean) => void;
}

export const ThreeRoot: React.FC<ThreeRootProps> = ({
  tier,
  active,
  onReadyChange,
}) => (
  <Canvas
    flat
    dpr={dprFor(tier)}
    frameloop="always"
    gl={{
      alpha: true,
      antialias: tier === "high",
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    }}
    className="velora-canvas"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    }}
    onCreated={({ gl }) => {
      gl.domElement.addEventListener(
        "webglcontextlost",
        (event) => {
          event.preventDefault();
          onReadyChange(false);
        },
        { passive: false }
      );
      gl.domElement.addEventListener("webglcontextrestored", () =>
        onReadyChange(true)
      );
    }}
  >
    <ReadySignal onReady={onReadyChange} />
    <TunnelOutlet />
    <ViewRenderer tier={tier} active={active} />
  </Canvas>
);
