"use client";

/**
 * The thread takes the colour of the room.
 *
 * Mount this anywhere with a `colour` and every filament, rule, card frame,
 * underline, stepper and tracker on the page bleeds to that hue over 900ms —
 * because all of them read `--thread` / `--thread-lit` and nothing else.
 * Nothing re-renders, nothing reloads, no component subscribes.
 *
 * Unmounting returns the page to gold over the same 900ms. Gold is home.
 */

import { useEffect } from "react";
import type { ColourKey } from "@/model/domain/types";
import { THREAD_GOLD, threadTone } from "./palette";

/** Writes the four variables the whole design system reads. */
function paint(tone: { base: string; lit: string; spec: string; ground: string }): void {
  const root = document.documentElement;
  root.style.setProperty("--thread", tone.base);
  root.style.setProperty("--thread-lit", tone.lit);
  root.style.setProperty("--thread-spec", tone.spec);
  root.style.setProperty("--page-bg", tone.ground);
}

export const ThreadColour: React.FC<{ colour?: ColourKey | null }> = ({ colour }) => {
  useEffect(() => {
    paint(threadTone(colour));
    return () => paint(THREAD_GOLD);
  }, [colour]);

  return null;
};
