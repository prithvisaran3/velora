/**
 * Device tiering — decided once, here, and nowhere else.
 *
 *   high — all six moments, DPR ≤ 1.75
 *   mid  — hero cloth + colour dye only, DPR ≤ 1.25, cloth grid halved
 *   low  — posters and CSS only, no canvas is ever created
 *
 * `prefers-reduced-motion` is always `low`. So is a device without WebGL,
 * with Save-Data on, or one that fails the 12-frame probe.
 */

import { TIER_DPR } from "@/lib/motion";

export type Tier = "high" | "mid" | "low";

/** Moments allowed per tier. Keep in sync with docs/3D-MOTION.md §3. */
const ALLOWED: Record<Tier, ReadonlySet<string>> = {
  high: new Set([
    "velLoader",
    "heroCloth",
    "colourDye",
    "pdpDrape",
    "palluUnroll",
    "bagFlight",
  ]),
  mid: new Set(["heroCloth", "colourDye", "bagFlight"]),
  low: new Set<string>(),
};

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

let cached: Tier | null = null;
let forced: Tier | null = null;
const listeners = new Set<(tier: Tier) => void>();

const RANK: Record<Tier, number> = { low: 0, mid: 1, high: 2 };

/**
 * QA override: `localStorage.velora_tier = 'high' | 'mid' | 'low'`.
 * A forced tier is never demoted, which is what makes it possible to record
 * each moment on one machine.
 */
function forcedTier(): Tier | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem("velora_tier");
    return value === "high" || value === "mid" || value === "low" ? value : null;
  } catch {
    return null;
  }
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return false;
    // Release the probe context immediately — it must not count against the
    // browser's per-page context budget.
    const lose = gl.getExtension("WEBGL_lose_context") as {
      loseContext(): void;
    } | null;
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function detect(): Tier {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "low";
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "low";
  }

  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData) return "low";
  if (nav.connection?.effectiveType === "2g" || nav.connection?.effectiveType === "slow-2g") {
    return "low";
  }
  if (!hasWebGL()) return "low";

  const fine = window.matchMedia("(pointer: fine)").matches;
  // Absent hints: assume a mid-range Android, which is the primary device.
  const memory = nav.deviceMemory ?? (fine ? 8 : 4);
  const cores = nav.hardwareConcurrency ?? (fine ? 8 : 4);

  if (memory <= 2 || cores <= 3) return "low";
  if (memory >= 8 && cores >= 8) return "high";
  return "mid";
}

/** The tier for this session. Computed once; safe to call anywhere. */
export function getTier(): Tier {
  if (cached === null) {
    forced = forcedTier();
    cached = forced ?? detect();
  }
  return cached;
}

export function subscribeTier(fn: (tier: Tier) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Demote only — a probe may never promote a device past its static budget. */
function demoteTo(tier: Tier): void {
  const current = getTier();
  if (forced !== null) return;
  if (RANK[tier] >= RANK[current]) return;
  cached = tier;
  listeners.forEach((fn) => fn(tier));
}

let probed = false;

/**
 * 12-frame probe. It runs once the canvas is live *and* has had 800ms to
 * settle: sampling during shader compilation would demote every device on
 * earth. A machine that then cannot hold its frame budget over twelve frames
 * drops a tier.
 */
export function runFrameProbe(): void {
  if (probed || typeof window === "undefined") return;
  probed = true;

  setTimeout(() => {
    const samples: number[] = [];
    let last = performance.now();

    const step = (now: number) => {
      samples.push(now - last);
      last = now;
      if (samples.length < 12) {
        requestAnimationFrame(step);
        return;
      }
      // Median is robust against a single stalled frame.
      const median = samples.slice().sort((a, b) => a - b)[6];
      if (median > 34) demoteTo("low");
      else if (median > 21) demoteTo("mid");
    };

    requestAnimationFrame(step);
  }, 800);
}

/** Reduced motion can be toggled mid-session; honour it immediately. */
export function watchReducedMotion(): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => {
    if (mq.matches) demoteTo("low");
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function tierAllows(tier: Tier, moment: string): boolean {
  return ALLOWED[tier].has(moment);
}

export function dprFor(tier: Tier): number {
  return TIER_DPR[tier];
}
