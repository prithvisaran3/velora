"use client";

/**
 * The living gold thread.
 *
 * Three layers per filament — a dull base strand, a bright filament with light
 * running along it, and a rare white specular that passes every few seconds.
 * One strand looks like a line; three looks like twisted silk. That is the
 * entire trick.
 *
 * The static paths are rendered on the server, so the field is the poster too:
 * with JS off, or before hydration, the threads are already there and still.
 * Only the cursor bend needs JS, and it is skipped outright on coarse pointers
 * and under prefers-reduced-motion.
 *
 * It knows nothing about sarees. Six or six hundred — the thread does not care.
 */

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  FILAMENT_SETS,
  POINTER_PULL,
  POINTER_RADIUS,
  SPRING,
  toPath,
  type FilamentVariant,
  type Point,
} from "./filaments";

interface ThreadFieldProps {
  variant?: FilamentVariant;
  /** Bend toward the cursor. Desktop hero only — it costs a rAF loop. */
  interactive?: boolean;
  className?: string;
}

const DRIFT_ANIMATION = { a: "thread-drift-a", b: "thread-drift-b", c: "thread-drift-c" } as const;

export const ThreadField: React.FC<ThreadFieldProps> = ({
  variant = "hero",
  interactive = false,
  className,
}) => {
  const set = FILAMENT_SETS[variant];
  const [vbWidth, vbHeight] = set.viewBox;
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !interactive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // One spring per control point. Endpoints are excluded: they live off the
    // edge of the box and bending them only shears the field's silhouette.
    const springs = set.filaments.map((filament) =>
      filament.points.map((point, i) => ({
        home: point,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        movable: i > 0 && i < filament.points.length - 1,
      }))
    );

    const groups = Array.from(svg.querySelectorAll<SVGGElement>("[data-filament]"));
    const pointer = { x: -1e5, y: -1e5, live: false };
    let frame = 0;
    let idle = 0;

    const onMove = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      // preserveAspectRatio is "none", so each axis maps independently.
      pointer.x = ((event.clientX - rect.left) / rect.width) * vbWidth;
      pointer.y = ((event.clientY - rect.top) / rect.height) * vbHeight;
      pointer.live = true;
      idle = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      pointer.live = false;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      let moving = false;

      springs.forEach((filament, fi) => {
        filament.forEach((spring) => {
          let targetX = 0;
          let targetY = 0;

          if (pointer.live && spring.movable) {
            const dx = pointer.x - (spring.home[0] + spring.x);
            const dy = pointer.y - (spring.home[1] + spring.y);
            const distance = Math.hypot(dx, dy);
            if (distance < POINTER_RADIUS && distance > 0.001) {
              const falloff = 1 - distance / POINTER_RADIUS;
              const pull = POINTER_PULL * falloff * falloff;
              targetX = (dx / distance) * pull;
              targetY = (dy / distance) * pull;
            }
          }

          spring.vx = (spring.vx + (targetX - spring.x) * SPRING.stiffness) * SPRING.damping;
          spring.vy = (spring.vy + (targetY - spring.y) * SPRING.stiffness) * SPRING.damping;
          spring.x += spring.vx;
          spring.y += spring.vy;

          if (Math.abs(spring.vx) > 0.01 || Math.abs(spring.vy) > 0.01) moving = true;
          else if (Math.abs(spring.x) > 0.05 || Math.abs(spring.y) > 0.05) moving = true;
        });

        const bent: Point[] = filament.map((spring) => [
          spring.home[0] + spring.x,
          spring.home[1] + spring.y,
        ]);
        const d = toPath(bent);
        // All three layers of a filament share one geometry.
        groups[fi]?.querySelectorAll("path").forEach((path) => path.setAttribute("d", d));
      });

      // Settle, then stop burning frames until the pointer comes back.
      idle = moving ? 0 : idle + 1;
      frame = idle > 4 ? 0 : requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [interactive, set, vbWidth, vbHeight]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      {set.filaments.map((filament, index) => {
        const d = toPath(filament.points);
        return (
          <g
            key={index}
            data-filament
            style={{
              opacity: filament.groupOpacity,
              animation: `${DRIFT_ANIMATION[filament.drift]} ${filament.driftDuration}s ${
                filament.driftDelay ?? 0
              }s ease-in-out infinite`,
            }}
          >
            <path
              d={d}
              fill="none"
              stroke="var(--thread)"
              strokeWidth={filament.baseWidth}
              opacity={filament.baseOpacity}
            />
            <path
              d={d}
              fill="none"
              stroke="var(--thread-lit)"
              strokeWidth={filament.litWidth}
              strokeDasharray={filament.litDash}
              style={{
                animation: `${
                  filament.litReverse ? "thread-flow-back" : "thread-flow"
                } ${filament.litDuration}s ${filament.litDelay ?? 0}s linear infinite`,
              }}
            />
            {filament.specWidth && filament.specDash && (
              <path
                d={d}
                fill="none"
                stroke="var(--thread-spec)"
                strokeWidth={filament.specWidth}
                strokeDasharray={filament.specDash}
                style={{
                  animation: `thread-flow ${filament.specDuration}s ${
                    filament.specDelay ?? 0
                  }s linear infinite`,
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
