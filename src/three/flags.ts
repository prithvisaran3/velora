/**
 * 3D moment flags.
 *
 * Every moment ships behind its own flag so a scene can be dark-launched or
 * pulled without a rollback. Next.js inlines `process.env.NEXT_PUBLIC_*` at
 * build time, so each name must be written out in full — no dynamic lookup.
 *
 * Default is ON. Set the variable to "0" or "false" to ship only the poster.
 *
 * v9 left two moments standing: the shelf you filter from, and the fold that
 * confirms a purchase. The saree itself is never animated — it is only ever a
 * still photograph — so the cloth scenes are gone rather than flagged off.
 */

const off = (value: string | undefined): boolean =>
  value === "0" || value === "false";

export const THREE_FLAGS = {
  /** 03 · the wall of thread cones behind the colour filter */
  coneWall: !off(process.env.NEXT_PUBLIC_3D_CONE_WALL),
  /** 06 · add-to-bag flight */
  bagFlight: !off(process.env.NEXT_PUBLIC_3D_BAG_FLIGHT),
} as const;

export type ThreeFlag = keyof typeof THREE_FLAGS;
