"use client";

/**
 * True once the element has been on screen — and it never goes back to false.
 *
 * The thread arrives when you reach it, and it does not un-arrive when you
 * scroll past. One observer per element, disconnected on the first hit.
 */

import { useEffect, useRef, useState } from "react";

export function useSewn<T extends Element>(
  threshold = 0.25
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [sewn, setSewn] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // No IntersectionObserver (or reduced motion): show the finished state.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setSewn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSewn(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, sewn];
}
