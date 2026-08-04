/**
 * Velora motion constants
 * Every duration and easing in the app comes from here. No inline values.
 * Silk falling, not UI popping: nothing bounces, nothing springs, nothing overshoots.
 */

export const EASE_SILK = [0.16, 1, 0.3, 1] as const;      // framer-motion
export const EASE_SILK_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const DURATION = {
  hover: 0.22,
  loupe: 0.22,
  crossfade: 0.6,     // flat-lay -> draped
  flight: 0.72,       // add-to-bag fold
  wipe: 0.78,         // page transition
  dye: 0.8,           // colour page dye
  draw: 0.9,          // divider + zari segment
} as const;

/** Loader beats, ms from t0. Total must never exceed 900ms. */
export const LOADER = {
  drawStart: 0,
  drawEnd: 260,
  closeEnd: 420,
  fillEnd: 520,
  wipeEnd: 780,
  revealEnd: 900,
} as const;

export const STAGGER = { children: 0.08, sections: 0.12 } as const;

export const transition = (duration: number, delay = 0) => ({
  duration,
  delay,
  ease: EASE_SILK,
});

/** Standard enter for mobile sections and desktop reveals. */
export const revealVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: transition(DURATION.wipe, delay),
  }),
} as const;

/** Saffron fabric wipe — the fold edge is a soft 5% gradient band, never a hard rectangle. */
export const FABRIC_WIPE_GRADIENT =
  "linear-gradient(0deg, #E8621B 0%, #E8621B 95%, #EE8A4A 97%, rgba(232,98,27,0) 100%)";

/**
 * Reduced motion: keep the information, drop the movement.
 * Call this once and branch — do not scatter media queries through components.
 */
export const reducedMotionOverrides = {
  duration: 0.12,
  loaderHoldMs: 200,
  disable: ["wipe", "dye", "draw", "flight", "loupe"] as const,
};

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- 3D additions (v2) ---- */

/** Hero cloth solver. */
export const CLOTH = {
  segments: 24,          // halved to 12 on the 'mid' tier
  iterations: 2,
  gravity: 0.0012,
  wind: 0.0004,
  settleMs: 1400,
  pointerInfluence: 0.15,
  pointerSmoothingMs: 400,
} as const;

/** Silk material — anisotropic sheen across the weft, zari sharper than the ground. */
export const SILK = {
  roughness: 0.42,
  sheenRoughness: 0.28,
  sheenLighten: 0.18,   // sheenColor = hue lightened by this
  zari: { metalness: 1, roughness: 0.18 },
} as const;

/** PDP drape orbit limits — the border must stay legible at every angle. */
export const ORBIT = { azimuth: 40, polar: 12, damping: 0.08, zoom: false } as const;

/** Macro loupe. */
export const LOUPE = { size: 250, targetPx: 512, fovScale: 1 / 3, edgePx: 2, lagMs: 220 } as const;

/** Scroll-driven pallu unroll. */
export const UNROLL = { pinVh: 120, annotations: [0.25, 0.55, 0.85] } as const;

/** Device tiers. Decide once, in three/tier.ts. */
export const TIER_DPR = { high: 1.75, mid: 1.25, low: 0 } as const;
export const FRAME_BUDGET_MS = { high: 16, mid: 33 } as const;
