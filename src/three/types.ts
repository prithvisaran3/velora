/**
 * The three-free contract between a route and the shared canvas.
 *
 * Nothing in this file may import `three`, `@react-three/fiber` or a scene:
 * it is reachable from the root layout, and anything reachable from the root
 * layout is downloaded before the first product image. Cameras are described,
 * not constructed — ThreeRoot builds them on the other side of the split.
 */

import type { ReactNode, RefObject } from "react";

export interface CameraSpec {
  kind?: "perspective" | "orthographic";
  /** Perspective only. */
  fov?: number;
  near?: number;
  far?: number;
  position?: readonly [number, number, number];
  /** Look-at target; defaults to the origin. */
  target?: readonly [number, number, number];
}

export interface SceneDescriptor {
  id: string;
  /** The DOM box the scene is scissored into. */
  track: RefObject<HTMLDivElement | null>;
  /** Draw order. Page scenes 0–9, overlays 10+. */
  order: number;
  camera: CameraSpec;
  /** Pixels clipped off the top so a scene never paints under the header. */
  clipTop?: () => number;
  enabled?: () => boolean;
  children: ReactNode;
}
