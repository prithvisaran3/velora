/**
 * Framing for the hero cloth. Separate from Scene.tsx so the route can name
 * a camera without pulling three into the eager bundle.
 *
 * Slightly off-axis and a touch above centre: the fold line falls below the
 * headline, which is the one place the cloth may not sit.
 */

import type { CameraSpec } from "../../types";

export const HERO_CAMERA: CameraSpec = {
  kind: "perspective",
  fov: 34,
  near: 0.1,
  far: 48,
  position: [0, 0.1, 9.6],
};

/** Desktop hangs the cloth right of centre, clear of the headline. */
export const HERO_LAYOUT_WIDE = {
  size: [4.6, 3.1] as [number, number],
  position: [1.9, 0.45, 0] as [number, number, number],
};

/** 390 first: the cloth takes the top of the frame, the headline the bottom. */
export const HERO_LAYOUT_NARROW = {
  size: [2.7, 1.9] as [number, number],
  position: [0.15, 1.15, 0] as [number, number, number],
};

/** The colour page shows the same cloth closer and squarer. */
export const DYE_CAMERA: CameraSpec = {
  kind: "perspective",
  fov: 30,
  near: 0.1,
  far: 40,
  position: [0, 0.1, 8.6],
};

/** The hero cloth is kora silk — a light ground keeps the ink headline legible. */
export const HERO_HEX = "#F3EADC";
