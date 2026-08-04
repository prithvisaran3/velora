/**
 * Add-to-bag flights (moment 06).
 *
 * Three-free on purpose: the PDP publishes a measured rect pair, and whatever
 * is listening decides how to fly it — the shared canvas when there is one, a
 * CSS transform of the same 720ms when there is not.
 */

export interface FlightRequest {
  id: number;
  /** FLIP "first": where the product image is, right now. */
  from: { x: number; y: number; width: number; height: number };
  /** "last": the bag. */
  to: { x: number; y: number };
  hex: string;
}

type Listener = (request: FlightRequest) => void;

const listeners = new Set<Listener>();
let nextId = 1;

export function onFlight(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function flyToBag(
  source: DOMRect,
  bag: DOMRect,
  hex: string,
  headerBottom = 0
): void {
  const request: FlightRequest = {
    id: nextId++,
    from: {
      x: source.left + source.width / 2,
      y: source.top + source.height / 2,
      width: source.width,
      height: source.height,
    },
    to: {
      x: bag.left + bag.width / 2,
      // The canvas paints below the sticky header, so the cloth lands just
      // clear of it and the bag icon takes over with its pulse.
      y: Math.max(bag.top + bag.height / 2, headerBottom + 6),
    },
    hex,
  };
  listeners.forEach((fn) => fn(request));
}

/** Fired when the flight lands; the header pulses the bag in marigold. */
export const BAG_PULSE_EVENT = "velora:bag-pulse";

export function pulseBag(): void {
  window.dispatchEvent(new Event(BAG_PULSE_EVENT));
}
