/**
 * Velora motion constants.
 *
 * Every duration and easing in the app comes from here. No inline values.
 * Silk falling, not UI popping: nothing bounces, nothing springs, nothing
 * overshoots. One easing everywhere — cubic-bezier(.16, 1, .3, 1).
 */

export const EASE_SILK = [0.16, 1, 0.3, 1] as const; // framer-motion
export const EASE_SILK_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DURATION = {
  hover: 0.22,
  loupe: 0.22,
  crossfade: 0.6,
  flight: 0.72, // add-to-bag fold
  wipe: 0.78, // page transition whip
  dye: 0.9, // the thread takes the room's colour
  draw: 0.9, // a rule or a stepper segment arriving
  stitch: 1.5, // a card frame sewing itself in
} as const;

/** Card frames sew this far apart, so a row reads left to right. */
export const STITCH_STAGGER_MS = 150;

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- 3D ---- */

/** Silk material — anisotropic sheen across the weft, zari sharper than the ground. */
export const SILK = {
  roughness: 0.42,
  sheenRoughness: 0.28,
  sheenLighten: 0.18, // sheenColor = hue lightened by this
  zari: { metalness: 1, roughness: 0.18 },
} as const;

/** Device tiers. Decided once, in three/tier.ts. */
export const TIER_DPR = { high: 1.75, mid: 1.25, low: 0 } as const;
export const FRAME_BUDGET_MS = { high: 16, mid: 33 } as const;
