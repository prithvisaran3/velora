/**
 * cubic-bezier(0.16, 1, 0.3, 1) evaluated in JS.
 *
 * The CSS easing is the brand's; scenes driven by a clock rather than by CSS
 * need the same curve or the 3D moments drift out of step with the 2D ones.
 */

import { EASE_SILK } from "@/lib/motion";

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    // Newton converges in four steps for this curve; bisection is the guard.
    for (let i = 0; i < 4; i += 1) {
      const slope = slopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t -= (sampleX(t) - x) / slope;
    }
    return sampleY(Math.min(Math.max(t, 0), 1));
  };
}

export const easeSilk = bezier(EASE_SILK[0], EASE_SILK[1], EASE_SILK[2], EASE_SILK[3]);

export const clamp01 = (value: number): number =>
  value < 0 ? 0 : value > 1 ? 1 : value;

/** Progress through a window of a timeline, eased. */
export function beat(now: number, start: number, end: number): number {
  return easeSilk(clamp01((now - start) / (end - start)));
}

/** Frame-rate independent exponential smoothing toward a target. */
export function damp(
  current: number,
  target: number,
  timeConstantMs: number,
  deltaMs: number
): number {
  const alpha = 1 - Math.exp(-deltaMs / Math.max(timeConstantMs, 1));
  return current + (target - current) * alpha;
}
