import type { CameraSpec } from "../../types";

/** Orbit radius and the point the camera always looks at. */
export const DRAPE_RADIUS = 5.9;
export const DRAPE_TARGET_Y = -0.28;
export const DRAPE_FOV = 30;

export const DRAPE_CAMERA: CameraSpec = {
  kind: "perspective",
  fov: DRAPE_FOV,
  near: 0.1,
  far: 40,
  position: [0, DRAPE_TARGET_Y, DRAPE_RADIUS],
  target: [0, DRAPE_TARGET_Y, 0],
};
