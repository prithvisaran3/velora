/**
 * The mount gate for the shared canvas.
 *
 * Rule (docs/3D-MOTION.md §2): the canvas is created after the hero <img> has
 * loaded *and* an idle callback has fired. No scene may sit in the critical
 * path. `markLcpReady()` is called by whatever paints the LCP element on the
 * route; a 2s safety timer covers routes that have no hero image at all.
 *
 * The one exception is `requestEarlyCanvas()`, used by the vel loader on a
 * first visit: the loader is a full-screen overlay, so during its 900ms the
 * page is not painting anything the canvas could delay, and the context it
 * creates is the one the hero cloth then inherits — a saving, not a cost.
 */

type Listener = () => void;

const LCP_SAFETY_MS = 2000;
const IDLE_TIMEOUT_MS = 1200;

let lcpReady = false;
let earlyRequested = false;
const lcpListeners = new Set<Listener>();
const earlyListeners = new Set<Listener>();
let safetyTimer: ReturnType<typeof setTimeout> | null = null;

function flush(set: Set<Listener>): void {
  const pending = Array.from(set);
  set.clear();
  pending.forEach((fn) => fn());
}

/** Called by the LCP element's onLoad. Idempotent. */
export function markLcpReady(): void {
  if (lcpReady) return;
  lcpReady = true;
  if (safetyTimer) {
    clearTimeout(safetyTimer);
    safetyTimer = null;
  }
  flush(lcpListeners);
}

function armSafetyTimer(): void {
  if (safetyTimer !== null || lcpReady || typeof window === "undefined") return;
  safetyTimer = setTimeout(markLcpReady, LCP_SAFETY_MS);
}

/** Resolves once the LCP element has painted (or the safety timer fires). */
export function onLcpReady(fn: Listener): () => void {
  if (lcpReady) {
    fn();
    return () => {};
  }
  armSafetyTimer();
  lcpListeners.add(fn);
  return () => lcpListeners.delete(fn);
}

interface IdleWindow {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
}

/** requestIdleCallback with the documented setTimeout fallback. */
export function whenIdle(fn: Listener): () => void {
  if (typeof window === "undefined") return () => {};
  const w = window as unknown as IdleWindow;
  if (typeof w.requestIdleCallback === "function") {
    const handle = w.requestIdleCallback(fn, { timeout: IDLE_TIMEOUT_MS });
    return () => w.cancelIdleCallback?.(handle);
  }
  const timer = setTimeout(fn, IDLE_TIMEOUT_MS);
  return () => clearTimeout(timer);
}

/**
 * Treat `load` as the outer bound of LCP: by then every render-blocking
 * resource and the hero media are done. Routes with a real hero <img> call
 * markLcpReady() sooner, and the 2s safety timer caps the wait either way.
 */
export function armLcpSignals(): () => void {
  if (typeof window === "undefined") return () => {};
  if (document.readyState === "complete") {
    markLcpReady();
    return () => {};
  }
  const onLoad = () => markLcpReady();
  window.addEventListener("load", onLoad, { once: true });
  return () => window.removeEventListener("load", onLoad);
}

/** The vel loader's escape hatch — see the note at the top of this file. */
export function requestEarlyCanvas(): void {
  if (earlyRequested) return;
  earlyRequested = true;
  flush(earlyListeners);
}

export function onEarlyCanvas(fn: Listener): () => void {
  if (earlyRequested) {
    fn();
    return () => {};
  }
  earlyListeners.add(fn);
  return () => earlyListeners.delete(fn);
}
