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

/**
 * Outer bound on waiting for LCP. Generous on purpose: on a slow route the
 * cost of waiting is a late scene, and the cost of not waiting is a 123 KB
 * chunk competing with the product image for bandwidth and main thread.
 */
const LCP_SAFETY_MS = 7000;
const IDLE_TIMEOUT_MS = 1200;
/** How long the LCP entry stream must be quiet before we call it settled. */
const LCP_QUIET_MS = 500;

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
 * Watch for LCP itself rather than guessing at it.
 *
 * The first version gated on `window.load` with a 2s safety timer, which was
 * wrong on any route whose LCP element paints late: on the PDP — a client
 * component that fetches its view model after hydration — the flat-lay lands
 * around 5.5s, so a 2s timer put the canvas and its 123 KB chunk in direct
 * competition with the thing we were supposed to be waiting for. It cost a
 * measured second of LCP on throttled 4G.
 *
 * Now: `load` *and* a quiet period on the largest-contentful-paint stream,
 * whichever resolves last, capped by the safety timer. Entries keep arriving
 * until first input, so quiet — not "an entry happened" — is the signal.
 */
export function armLcpSignals(): () => void {
  if (typeof window === "undefined") return () => {};

  let loaded = document.readyState === "complete";
  let lastEntry = performance.now();
  let quietTimer: ReturnType<typeof setTimeout> | null = null;
  let observer: PerformanceObserver | null = null;

  const settle = () => {
    if (!loaded || lcpReady) return;
    if (quietTimer) clearTimeout(quietTimer);
    const waited = performance.now() - lastEntry;
    if (waited >= LCP_QUIET_MS) {
      markLcpReady();
      return;
    }
    quietTimer = setTimeout(settle, LCP_QUIET_MS - waited);
  };

  try {
    observer = new PerformanceObserver((list) => {
      if (list.getEntries().length > 0) lastEntry = performance.now();
      settle();
    });
    observer.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // No LCP entry type (Safari): `load` plus the safety timer carry it.
  }

  const onLoad = () => {
    loaded = true;
    settle();
  };
  if (loaded) settle();
  else window.addEventListener("load", onLoad, { once: true });

  return () => {
    window.removeEventListener("load", onLoad);
    observer?.disconnect();
    if (quietTimer) clearTimeout(quietTimer);
  };
}

/* ------------------------------------------------------------------ */
/* Demand — nobody wants a canvas, nobody pays for one                 */
/* ------------------------------------------------------------------ */

/**
 * The LCP gate alone is not enough. On a route that renders "Loading…" and
 * fetches after hydration, `load` fires long before the real hero exists, so
 * the gate opens and the 123 KB chunk downloads alongside the product image.
 *
 * So the canvas is also demand-driven: a route declares it wants one, and
 * until something does, nothing is fetched. On a PDP the only scene is the
 * drape, which declares itself on intersection — so scrolling is what pays for
 * the context, and the flat-lay never competes with it.
 */
let demand = 0;
const demandListeners = new Set<(wanted: boolean) => void>();

export function canvasWanted(): boolean {
  return demand > 0;
}

/** Returns a release function; call it when the scene no longer wants one. */
export function requestCanvas(): () => void {
  demand += 1;
  if (demand === 1) demandListeners.forEach((fn) => fn(true));
  let released = false;
  return () => {
    if (released) return;
    released = true;
    demand -= 1;
    if (demand === 0) demandListeners.forEach((fn) => fn(false));
  };
}

export function onCanvasDemand(fn: (wanted: boolean) => void): () => void {
  demandListeners.add(fn);
  return () => {
    demandListeners.delete(fn);
  };
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
