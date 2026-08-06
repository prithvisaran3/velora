"use client";

/**
 * A media query as React state, without a hydration mismatch.
 *
 * `useSyncExternalStore` is the point: the server snapshot is always `false`,
 * so the markup React renders on the server is deterministic and the threads
 * are in the first paint with JS off — and the client re-reads the real query
 * immediately after hydration instead of throwing a mismatch.
 *
 * This is how the hero picks its filament set. A CSS-only hide would put both
 * SVGs in the DOM and animate the one nobody can see.
 */

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
    [query]
  );

  // The server cannot know the viewport. It renders the desktop field, which
  // is also the poster — never nothing.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
