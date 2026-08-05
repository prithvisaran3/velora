"use client";

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SceneView } from "@/three/SceneView";
import { useCanvasReady, useThreeTier } from "@/three/CanvasProvider";
import { THREE_FLAGS } from "@/three/flags";
import { tierAllows } from "@/three/tier";
import { onFlight, pulseBag, type FlightRequest } from "@/three/store/flight";
import { DURATION, EASE_SILK_CSS } from "@/lib/motion";
import type { CameraSpec } from "@/three/types";

const BagFlightScene = dynamic(
  () => import("@/three/scenes/bagFlight/Scene").then((mod) => mod.BagFlightScene),
  { ssr: false, loading: () => null }
);

/** Pixel-for-pixel: the renderer sizes an ortho view from the tracked rect. */
const OVERLAY_CAMERA: CameraSpec = {
  kind: "orthographic",
  near: 0.1,
  far: 100,
  position: [0, 0, 10],
};

/**
 * The same 720ms arc without a canvas — `low`, reduced motion, and any moment
 * the context is not up yet. A folded look is faked with a skew; the timing,
 * the easing and the landing pulse are identical.
 */
function cssFlight(request: FlightRequest): void {
  const node = document.createElement("div");
  const { from, to, hex } = request;
  node.style.cssText = [
    "position:fixed",
    `left:${from.x - from.width / 2}px`,
    `top:${from.y - from.height / 2}px`,
    `width:${from.width}px`,
    `height:${from.height}px`,
    `background:linear-gradient(140deg, ${hex} 0%, rgba(36,31,28,0.55) 100%)`,
    "z-index:45",
    "pointer-events:none",
    "will-change:transform,opacity",
    `transition:transform ${DURATION.flight}s ${EASE_SILK_CSS}, opacity ${DURATION.flight}s ${EASE_SILK_CSS}`,
  ].join(";");
  document.body.appendChild(node);

  requestAnimationFrame(() => {
    node.style.transform = `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(0.28) rotate(-24deg)`;
    node.style.opacity = "0";
  });

  window.setTimeout(() => {
    node.remove();
    pulseBag();
  }, DURATION.flight * 1000);
}

/**
 * 06 · The flight overlay.
 *
 * Mounted once, next to the canvas, and idle until a PDP publishes a measured
 * rect pair. Drawn at order 10 so it sits above every page scene.
 */
export const BagFlight: React.FC = () => {
  const tier = useThreeTier();
  const canvasReady = useCanvasReady();
  const [request, setRequest] = useState<FlightRequest | null>(null);

  const canUseCanvas =
    THREE_FLAGS.bagFlight && canvasReady && tierAllows(tier, "bagFlight");

  useEffect(() => {
    return onFlight((next) => {
      if (canUseCanvas) setRequest(next);
      else cssFlight(next);
    });
  }, [canUseCanvas]);

  const onDone = useCallback(() => {
    setRequest(null);
    pulseBag();
  }, []);

  if (!request || !canUseCanvas) return null;

  return (
    <SceneView
      className="pointer-events-none fixed inset-0"
      order={10}
      camera={OVERLAY_CAMERA}
    >
      <BagFlightScene key={request.id} request={request} onDone={onDone} />
    </SceneView>
  );
};
