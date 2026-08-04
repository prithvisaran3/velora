/**
 * Framing for the vel loader. Kept apart from Scene.tsx because the route
 * references it eagerly and Scene.tsx pulls three.
 *
 * At fov 30 / z 10 the flat mark measures ~60px across in the 160×134 box —
 * the same size as the 2D poster it replaces, so the crossfade does not jump.
 * The settle beat lerps to fov 12 / z 25.5, which keeps that framing while the
 * perspective flattens to a near-orthographic lockup.
 */

import type { CameraSpec } from "../../types";

export const LOADER_FOV_START = 30;
export const LOADER_FOV_FLAT = 12;
export const LOADER_Z_START = 10;
export const LOADER_Z_FLAT = 25.5;

export const LOADER_CAMERA: CameraSpec = {
  kind: "perspective",
  fov: LOADER_FOV_START,
  near: 0.5,
  far: 60,
  position: [0, 0, LOADER_Z_START],
};
