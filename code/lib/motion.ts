/**
 * Velora motion constants — copy to src/lib/motion.ts
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

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
