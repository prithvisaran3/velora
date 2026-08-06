"use client";

/**
 * 03 · Browse by colour — a wall of thread cones.
 *
 * This replaces the flat swatch row. Same function, far more memorable: it is
 * the weaver's shelf, and it is how women actually shop.
 *
 * The CSS cones are the poster and they are real links — the filter works with
 * JS off, on a `low` device, and under reduced motion. The 3D shelf only ever
 * swaps into the identical box on top of them, so there is no shift and
 * nothing here can hold up the grid below.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SceneView } from "@/three/SceneView";
import { useCanvasReady, useThreeTier } from "@/three/CanvasProvider";
import { THREE_FLAGS } from "@/three/flags";
import { tierAllows } from "@/three/tier";
import { useCanvasDemand } from "@/three/useCanvasDemand";
import {
  CONE_CAMERA,
  CONE_COLOURS,
  CONE_SHADE,
  CONE_TARGET_Y,
  CONE_VIEW_HEIGHT,
} from "@/three/scenes/coneWall/camera";
import type { ConeLayout } from "@/three/scenes/coneWall/Scene";
import { SectionHead } from "@/view/primitives/SectionHead";
import { cn } from "@/lib/utils";

const ConeWallScene = dynamic(
  () => import("@/three/scenes/coneWall/Scene").then((mod) => mod.ConeWallScene),
  { ssr: false, loading: () => null }
);

interface ConeWallProps {
  eyebrow?: string;
  heading?: string;
  /** Highlighted cone, when the page is already inside a colour. */
  selected?: string;
}

export const ConeWall: React.FC<ConeWallProps> = ({
  eyebrow = "HOW WOMEN ACTUALLY SHOP",
  heading = "Pick your colour",
  selected,
}) => {
  const tier = useThreeTier();
  const canvasReady = useCanvasReady();
  const [hovered, setHovered] = useState(-1);
  /** Set by the scene itself, from inside the render loop. */
  const [scenePainted, setScenePainted] = useState(false);

  const eligible = THREE_FLAGS.coneWall && tierAllows(tier, "coneWall");
  useCanvasDemand(eligible);

  const onPainted = useCallback(() => setScenePainted(true), []);

  // The poster is the spec. Measuring it and converting to world units is what
  // makes the 3D shelf land on the CSS one at every breakpoint — otherwise the
  // cones drift off their labels and hovering MAROON spins the cone sitting
  // above PEACOCK.
  const boxRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<ConeLayout | undefined>(undefined);

  useEffect(() => {
    const measure = () => {
      const box = boxRef.current;
      const row = rowRef.current;
      if (!box || !row) return;
      const cones = row.querySelectorAll<HTMLElement>("[data-cone-poster]");
      if (cones.length < 2) return;

      const boxRect = box.getBoundingClientRect();
      const first = cones[0].getBoundingClientRect();
      const second = cones[1].getBoundingClientRect();
      if (boxRect.height < 1 || first.height < 1) return;

      const unitsPerPx = CONE_VIEW_HEIGHT / boxRect.height;
      const posterCy = first.top + first.height / 2;
      const boxCy = boxRect.top + boxRect.height / 2;

      setLayout({
        radius: (first.width / 2) * unitsPerPx,
        height: first.height * unitsPerPx,
        spacing: (second.left - first.left) * unitsPerPx,
        // Screen y grows down, world y grows up.
        centreY: CONE_TARGET_Y - (posterCy - boxCy) * unitsPerPx,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (boxRef.current) observer.observe(boxRef.current);
    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  /** Mount the scene when the canvas is up... */
  const showCones = eligible && canvasReady;
  /** ...but only stand the poster down once the shelf is demonstrably drawn. */
  const posterRetired = showCones && scenePainted;

  return (
    /* Full-bleed ground, text on the measure. */
    <section className="thread-ground relative flex flex-col justify-between gap-10 overflow-hidden py-10 md:h-[520px] md:py-11">
      <div className="measure">
        <SectionHead eyebrow={eyebrow} title={heading} />
      </div>

      {/* The 3D shelf sits exactly over the poster row — see `layout`. The box
          is always in the DOM so it can be measured before the canvas exists. */}
      <div
        ref={boxRef}
        className="pointer-events-none absolute inset-x-0 bottom-[64px] h-[190px] md:bottom-[86px] md:h-[240px]"
        aria-hidden
      >
        {showCones && (
          <SceneView className="h-full w-full" order={0} camera={CONE_CAMERA}>
            <ConeWallScene hovered={hovered} onPainted={onPainted} layout={layout} />
          </SceneView>
        )}
      </div>

      <div
        ref={rowRef}
        className="relative z-10 flex items-end justify-center gap-4 overflow-x-auto no-scrollbar md:gap-[30px]"
        onPointerLeave={() => setHovered(-1)}
      >
        {CONE_COLOURS.map((cone, index) => {
          const [dark, light, mid] = CONE_SHADE[cone.key];
          const isSelected = selected === cone.key;
          return (
            <Link
              key={cone.key}
              href={`/colour/${cone.key}`}
              onPointerEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              className="group flex flex-shrink-0 flex-col items-center gap-3 transition-transform duration-500 ease-silk hover:-translate-y-3"
              aria-current={isSelected ? "page" : undefined}
            >
              <span
                data-cone-poster
                className={cn(
                  "thread-bob block h-[104px] w-[58px] transition-opacity duration-crossfade ease-silk md:h-[132px] md:w-[74px]",
                  // The scene draws its own cones; hiding the poster underneath
                  // avoids two shelves in the same box. Gated on the scene
                  // having painted, never on the canvas merely existing.
                  posterRetired && "opacity-0"
                )}
                style={{
                  background: `conic-gradient(from 90deg at 50% 50%, ${mid}, ${dark}, ${light}, ${mid})`,
                  clipPath: "polygon(26% 0, 74% 0, 100% 100%, 0 100%)",
                  boxShadow: "0 16px 26px -12px rgba(120, 84, 40, 0.55)",
                  animationDelay: `${index * 0.4}s`,
                }}
                aria-hidden
              />
              <span
                className={cn(
                  "font-sans text-[9px] uppercase tracking-[0.22em] transition-colors md:text-[10px]",
                  isSelected ? "text-saffron" : "text-ink/70 group-hover:text-saffron"
                )}
              >
                {cone.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
