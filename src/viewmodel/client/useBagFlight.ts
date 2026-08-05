"use client";

import { useCallback } from "react";
import { flyToBag } from "@/three/store/flight";

/**
 * FLIP-measure the product image and throw it at the bag.
 *
 * The bag is found by `data-bag-target`, which the header owns; if either end
 * is missing the flight is simply skipped — adding to the bag has already
 * happened by then and must never depend on the animation.
 */
export function useBagFlight() {
  return useCallback((source: HTMLElement | null, hex: string) => {
    if (!source) return;
    const bag = document.querySelector("[data-bag-target]");
    if (!bag) return;

    const header = document.querySelector("header");
    const headerBottom = header?.getBoundingClientRect().bottom ?? 0;

    flyToBag(
      source.getBoundingClientRect(),
      bag.getBoundingClientRect(),
      hex,
      headerBottom
    );
  }, []);
}
