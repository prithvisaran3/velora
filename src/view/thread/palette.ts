/**
 * The thread's colour, per room.
 *
 * Gold is home. Every other entry is a visit: opening a maroon saree bleeds
 * every filament on the page to maroon over 900ms, and leaving returns it to
 * gold over the same 900ms.
 *
 * `ground` is the 4% nudge applied to the page background — beige stays beige,
 * but a maroon room feels warmer and a peacock room cooler. Subtle enough that
 * nobody names it. The photographs are never touched.
 */

import type { ColourKey } from "@/model/domain/types";

export interface ThreadTone {
  /** The dull base strand. */
  base: string;
  /** The bright filament with light running along it. */
  lit: string;
  /** The rare white specular that passes every few seconds. */
  spec: string;
  /** The page ground for this room. */
  ground: string;
}

/** Zari gold — the brand, and what the site returns to. */
export const THREAD_GOLD: ThreadTone = {
  base: "#C9901E",
  lit: "#FFDD8E",
  spec: "#FFF3D2",
  ground: "#EDE2CE",
};

export const THREAD_PALETTE: Record<ColourKey, ThreadTone> = {
  maroon:   { base: "#8C1B30", lit: "#D9536E", spec: "#F6C9D2", ground: "#EBDDD0" },
  peacock:  { base: "#12514E", lit: "#4FBDB4", spec: "#CFEDE9", ground: "#E4E5DA" },
  indigo:   { base: "#2E4A7D", lit: "#7FA0D8", spec: "#D6E1F5", ground: "#E2E2D9" },
  leaf:     { base: "#4E7031", lit: "#8FBF63", spec: "#DCEFC9", ground: "#E6E5CE" },
  plum:     { base: "#6B3FA0", lit: "#B48AE0", spec: "#E7D9F6", ground: "#E7DFEC" },
  kora:     { base: "#9A855A", lit: "#DCCBA4", spec: "#F5EEDF", ground: "#EEE4D0" },
  saffron:  { base: "#8E3410", lit: "#E0692C", spec: "#FAD6BC", ground: "#EFDFCB" },
  marigold: THREAD_GOLD,
};

/** The tone for a room, or gold when there is no room. */
export function threadTone(colour?: ColourKey | null): ThreadTone {
  return colour ? THREAD_PALETTE[colour] ?? THREAD_GOLD : THREAD_GOLD;
}
