"use client";

import { useEffect } from "react";
import { requestCanvas } from "./boot";

/**
 * Declare that this scene wants the shared canvas.
 *
 * Pass the same condition that decides whether the scene will render at all —
 * flag, tier, and for anything below the fold, whether it is on screen yet.
 * While no scene wants a canvas, three is never fetched and no context exists.
 */
export function useCanvasDemand(wanted: boolean): void {
  useEffect(() => {
    if (!wanted) return;
    return requestCanvas();
  }, [wanted]);
}
