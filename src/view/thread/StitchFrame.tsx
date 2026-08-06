"use client";

/**
 * The gold frame a product card draws around itself on arrival.
 *
 * This is the thread reaching the card, and it is the only motion in the grid —
 * so the photographs stay the loudest thing on screen. No image swap, no video,
 * no zoom: her photo is not fighting anything.
 *
 * `delay` is the card's index in its row band × 150ms, so a row sews left to
 * right rather than all at once.
 */

import React from "react";
import { cn } from "@/lib/utils";
import { useSewn } from "./useSewn";

/** Perimeter of the 94 × 127 rect inside the 100 × 133 box. */
const FRAME_LENGTH = 442;

/**
 * Base first, lit on top. The base is wider by half a pixel each side, so it
 * reads as the dull edge of a thread that has a bright filament running down
 * the middle of it — the same construction as ThreadField, and the reason the
 * frame survives every ground it can land on.
 */
const STRANDS = [
  { stroke: "var(--thread)", width: 2 },
  { stroke: "var(--thread-lit)", width: 1 },
] as const;

export const StitchFrame: React.FC<{ delayMs?: number; className?: string }> = ({
  delayMs = 0,
  className,
}) => {
  const [ref, sewn] = useSewn<SVGSVGElement>(0.2);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 133"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* Two strands, as in the field: a dull base wide enough to hold the
          edge, and the bright filament laid on top of it. The lit strand
          alone vanished on kora and against pale flat-lay photography —
          #DCCBA4 on near-white sand is not an edge. */}
      {STRANDS.map(({ stroke, width }) => (
        <rect
          key={stroke}
          x="3"
          y="3"
          width="94"
          height="127"
          fill="none"
          stroke={stroke}
          strokeWidth={width}
          vectorEffect="non-scaling-stroke"
          style={{
            // @ts-expect-error -- --len is read by the thread-stitch keyframe.
            "--len": FRAME_LENGTH,
            strokeDasharray: FRAME_LENGTH,
            strokeDashoffset: sewn ? 0 : FRAME_LENGTH,
            animation: sewn
              ? `thread-stitch 1.5s ${delayMs}ms var(--ease-silk) both`
              : undefined,
          }}
        />
      ))}
    </svg>
  );
};
