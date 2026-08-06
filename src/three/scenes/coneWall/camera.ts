/**
 * Framing for the cone wall. Separate from Scene.tsx so the route can name a
 * camera without pulling three into the eager bundle.
 *
 * Straight on and slightly above, the way you look at a shelf.
 */

import type { CameraSpec } from "../../types";

export const CONE_CAMERA: CameraSpec = {
  kind: "perspective",
  fov: 30,
  near: 0.1,
  far: 40,
  position: [0, 0.35, 9.4],
  target: [0, -0.15, 0],
};

/**
 * How much world the camera sees, vertically, at the target plane.
 *
 * ThreeRoot frames the whole tracked box with the camera's vertical fov, so
 * this constant is what converts a pixel measured in the DOM into a world unit
 * in the scene — which is how the 3D shelf lands exactly on the CSS poster it
 * replaces instead of near it.
 */
export const CONE_VIEW_HEIGHT =
  2 *
  Math.hypot(
    (CONE_CAMERA.position?.[1] ?? 0) - (CONE_CAMERA.target?.[1] ?? 0),
    CONE_CAMERA.position?.[2] ?? 0
  ) *
  Math.tan((((CONE_CAMERA.fov ?? 30) / 2) * Math.PI) / 180);

/** Camera-space y of the point that projects to the centre of the box. */
export const CONE_TARGET_Y = CONE_CAMERA.target?.[1] ?? 0;

/** Seven cones, hard-coded. She never adds one — she just tags a saree. */
export const CONE_COLOURS = [
  { key: "maroon", hex: "#9E1B34", label: "Maroon" },
  { key: "peacock", hex: "#12514E", label: "Peacock" },
  { key: "indigo", hex: "#2E4A7D", label: "Indigo" },
  { key: "leaf", hex: "#4E7031", label: "Leaf" },
  { key: "plum", hex: "#6B3FA0", label: "Plum" },
  { key: "saffron", hex: "#C6521A", label: "Saffron" },
  { key: "kora", hex: "#C7B48A", label: "Kora" },
] as const;

/** The darker face of each cone, for the CSS poster's conic gradient. */
export const CONE_SHADE: Record<string, readonly [string, string, string]> = {
  maroon: ["#7A1428", "#B02540", "#9E1B34"],
  peacock: ["#0A3230", "#1B6A66", "#12514E"],
  indigo: ["#1D3055", "#3B5F9C", "#2E4A7D"],
  leaf: ["#2E4A1D", "#639140", "#4E7031"],
  plum: ["#452770", "#8250C4", "#6B3FA0"],
  saffron: ["#8A3410", "#E0692C", "#C6521A"],
  kora: ["#9A855A", "#DCCBA4", "#C7B48A"],
};
