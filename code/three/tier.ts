/** One decision for the whole session. 'low' never creates a WebGL context. */
export type Tier = "high" | "mid" | "low";

export function detectTier(): Tier {
  if (typeof window === "undefined") return "low";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
  const fine = window.matchMedia("(pointer:fine)").matches;

  const gl = document.createElement("canvas").getContext("webgl2");
  if (!gl) return "low";

  if (cores >= 8 && memory >= 8) return "high";
  if (fine && cores >= 6) return "high";
  if (cores >= 4 && memory >= 4) return "mid";
  return "low";
}

/** Confirm the guess with a short frame probe; downgrade if we cannot hold the budget. */
export function probeTier(tier: Tier, onResult: (t: Tier) => void, frames = 12) {
  if (tier === "low") return onResult("low");
  const times: number[] = [];
  let last = performance.now();
  const tick = () => {
    const now = performance.now();
    times.push(now - last);
    last = now;
    if (times.length < frames) return requestAnimationFrame(tick);
    const median = times.sort((a, b) => a - b)[Math.floor(frames / 2)];
    onResult(median > 34 ? (tier === "high" ? "mid" : "low") : tier);
  };
  requestAnimationFrame(tick);
}
