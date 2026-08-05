"use client";

/**
 * A scene's footprint in the page.
 *
 * Renders one empty box and publishes a descriptor into the shared canvas.
 * The box is the scene's exact rect, so a poster and its scene occupy the
 * identical space and the swap costs no layout shift. Contains no `three`.
 */

import React, { useId, useLayoutEffect, useMemo, useRef } from "react";
import { useCanvasReady } from "./CanvasProvider";
import { publishScene, retractScene } from "./sceneTunnel";
import type { CameraSpec } from "./types";

export interface SceneViewProps {
  order?: number;
  className?: string;
  style?: React.CSSProperties;
  camera?: CameraSpec;
  clipTop?: () => number;
  enabled?: () => boolean;
  children: React.ReactNode;
}

const DEFAULT_CAMERA: CameraSpec = {
  kind: "perspective",
  fov: 32,
  near: 0.1,
  far: 100,
  position: [0, 0, 6.4],
};

export const SceneView: React.FC<SceneViewProps> = ({
  order = 0,
  className,
  style,
  camera = DEFAULT_CAMERA,
  clipTop,
  enabled,
  children,
}) => {
  const id = useId();
  const track = useRef<HTMLDivElement>(null);
  const canvasReady = useCanvasReady();

  const descriptor = useMemo(
    () => ({ id, track, order, camera, clipTop, enabled, children }),
    [id, order, camera, clipTop, enabled, children]
  );

  // Publish on change, retract only on unmount. Retracting and republishing
  // on every page render would tear the scene down and rebuild it — the cloth
  // would restart its fall each time the route re-rendered.
  useLayoutEffect(() => {
    if (canvasReady) publishScene(descriptor);
  }, [canvasReady, descriptor]);

  useLayoutEffect(() => () => retractScene(id), [id]);

  return <div ref={track} className={className} style={style} aria-hidden />;
};
