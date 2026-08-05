/**
 * The filaments, transcribed from the v9 design.
 *
 * Each filament is a chain of cubic control points, not a path string, because
 * the cursor has to be able to bend the control points at runtime. The `d`
 * attribute is rebuilt from these on every frame the pointer is moving.
 *
 * Drift periods are prime-ish so the six cycles never sync up. Motion is
 * always present and never demands attention.
 */

export type Point = readonly [number, number];
export type Drift = "a" | "b" | "c";

export interface Filament {
  /** 3n+1 control points: p0, then (c1 c2 p1) per cubic segment. */
  points: readonly Point[];
  /** The dull base strand. */
  baseWidth: number;
  baseOpacity: number;
  /** The bright filament with light running along it. */
  litWidth: number;
  litDash: string;
  litDuration: number;
  litReverse?: boolean;
  litDelay?: number;
  /** The rare white specular that passes every few seconds. */
  specWidth?: number;
  specDash?: string;
  specDuration?: number;
  specDelay?: number;
  drift: Drift;
  driftDuration: number;
  driftDelay?: number;
  groupOpacity?: number;
}

export interface FilamentSet {
  viewBox: readonly [number, number];
  filaments: readonly Filament[];
}

/** The home hero — six threads on 15–29s cycles. */
export const HERO_FILAMENTS: FilamentSet = {
  viewBox: [1348, 770],
  filaments: [
    {
      points: [[-30, 118], [240, 92], [420, 208], [660, 230], [900, 252], [1080, 128], [1390, 154]],
      baseWidth: 2.4, baseOpacity: 0.55,
      litWidth: 1.3, litDash: "34 150", litDuration: 9,
      specWidth: 0.9, specDash: "10 420", specDuration: 6.2,
      drift: "a", driftDuration: 17,
    },
    {
      points: [[-30, 196], [280, 176], [460, 268], [700, 286], [940, 304], [1120, 202], [1390, 222]],
      baseWidth: 1.7, baseOpacity: 0.38,
      litWidth: 1, litDash: "26 190", litDuration: 12, litReverse: true,
      drift: "b", driftDuration: 21,
    },
    {
      points: [[-30, 380], [300, 354], [520, 424], [760, 398], [1000, 372], [1160, 430], [1390, 406]],
      baseWidth: 1.5, baseOpacity: 0.3,
      litWidth: 0.9, litDash: "20 240", litDuration: 14,
      drift: "c", driftDuration: 25,
    },
    {
      points: [[-30, 520], [260, 548], [470, 452], [700, 476], [930, 500], [1120, 566], [1390, 542]],
      baseWidth: 1.6, baseOpacity: 0.34,
      litWidth: 1, litDash: "30 170", litDuration: 10.5, litReverse: true,
      drift: "b", driftDuration: 19, driftDelay: 1.4,
    },
    {
      points: [[-30, 642], [260, 670], [470, 556], [700, 580], [930, 604], [1120, 692], [1390, 664]],
      baseWidth: 2.1, baseOpacity: 0.5,
      litWidth: 1.2, litDash: "34 150", litDuration: 11,
      specWidth: 0.8, specDash: "10 460", specDuration: 7.4, specDelay: 2,
      drift: "a", driftDuration: 23, driftDelay: 0.8,
    },
    {
      points: [[-30, 712], [300, 700], [520, 742], [760, 726], [1000, 710], [1160, 748], [1390, 734]],
      baseWidth: 1.2, baseOpacity: 1,
      litWidth: 0.8, litDash: "18 260", litDuration: 16, litReverse: true,
      drift: "c", driftDuration: 29, driftDelay: 2.2, groupOpacity: 0.24,
    },
  ],
};

/** A wide band — section backdrops and the colour strip. */
export const BAND_FILAMENTS: FilamentSet = {
  viewBox: [1346, 300],
  filaments: [
    {
      points: [[-30, 92], [260, 66], [460, 158], [700, 176], [940, 194], [1120, 90], [1390, 112]],
      baseWidth: 2.6, baseOpacity: 0.6,
      litWidth: 1.4, litDash: "34 150", litDuration: 8,
      drift: "a", driftDuration: 15,
    },
    {
      points: [[-30, 214], [280, 240], [470, 148], [700, 172], [930, 196], [1120, 258], [1390, 236]],
      baseWidth: 2, baseOpacity: 0.45,
      litWidth: 1.1, litDash: "28 180", litDuration: 11, litReverse: true,
      drift: "b", driftDuration: 19,
    },
  ],
};

/** A small panel — two short filaments, one cubic each. */
export const PANEL_FILAMENTS: FilamentSet = {
  viewBox: [320, 150],
  filaments: [
    {
      points: [[-10, 48], [70, 32], [150, 96], [330, 74]],
      baseWidth: 2.4, baseOpacity: 0.55,
      litWidth: 1.3, litDash: "22 90", litDuration: 6,
      drift: "a", driftDuration: 15,
    },
    {
      points: [[-10, 112], [90, 128], [170, 76], [330, 100]],
      baseWidth: 1.6, baseOpacity: 0.38,
      litWidth: 1, litDash: "18 110", litDuration: 8, litReverse: true,
      drift: "b", driftDuration: 19,
    },
  ],
};

export const FILAMENT_SETS = {
  hero: HERO_FILAMENTS,
  band: BAND_FILAMENTS,
  panel: PANEL_FILAMENTS,
} as const;

export type FilamentVariant = keyof typeof FILAMENT_SETS;

/** Build the `d` attribute for a chain of cubic control points. */
export function toPath(points: readonly Point[]): string {
  const [start, ...rest] = points;
  let d = `M ${start[0]} ${start[1]}`;
  for (let i = 0; i + 2 < rest.length + 1; i += 3) {
    const c1 = rest[i];
    const c2 = rest[i + 1];
    const end = rest[i + 2];
    if (!c1 || !c2 || !end) break;
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${end[0]} ${end[1]}`;
  }
  return d;
}

/** Cursor spring, per the design: stiffness .06, damping .82. */
export const SPRING = { stiffness: 0.06, damping: 0.82 } as const;

/** How far, in viewBox units, a control point feels the cursor. */
export const POINTER_RADIUS = 260;
/** The furthest a control point will travel toward the cursor. */
export const POINTER_PULL = 34;
