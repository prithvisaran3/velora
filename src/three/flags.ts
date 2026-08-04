/**
 * P2 · 3D moment flags.
 *
 * Every moment ships behind its own flag so a scene can be dark-launched or
 * pulled without a rollback. Next.js inlines `process.env.NEXT_PUBLIC_*` at
 * build time, so each name must be written out in full — no dynamic lookup.
 *
 * Default is ON. Set the variable to "0" or "false" to ship only the poster.
 */

const off = (value: string | undefined): boolean =>
  value === "0" || value === "false";

export const THREE_FLAGS = {
  /** 01 · extruded vel loader, first visit only */
  velLoader: !off(process.env.NEXT_PUBLIC_3D_VEL_LOADER),
  /** 02 · home hero cloth */
  heroCloth: !off(process.env.NEXT_PUBLIC_3D_HERO_CLOTH),
  /** 03 · colour dye on the shared fabric */
  colourDye: !off(process.env.NEXT_PUBLIC_3D_COLOUR_DYE),
  /** 04 · PDP drape + macro loupe */
  pdpDrape: !off(process.env.NEXT_PUBLIC_3D_PDP_DRAPE),
  /** 05 · scroll-driven pallu unroll */
  palluUnroll: !off(process.env.NEXT_PUBLIC_3D_PALLU_UNROLL),
  /** 06 · add-to-bag flight */
  bagFlight: !off(process.env.NEXT_PUBLIC_3D_BAG_FLIGHT),
} as const;

export type ThreeFlag = keyof typeof THREE_FLAGS;
