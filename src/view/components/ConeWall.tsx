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

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SceneView } from "@/three/SceneView";
import { useCanvasReady, useThreeTier } from "@/three/CanvasProvider";
import { THREE_FLAGS } from "@/three/flags";
import { tierAllows } from "@/three/tier";
import { useCanvasDemand } from "@/three/useCanvasDemand";
import { CONE_CAMERA, CONE_COLOURS, CONE_SHADE } from "@/three/scenes/coneWall/camera";
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

  const eligible = THREE_FLAGS.coneWall && tierAllows(tier, "coneWall");
  useCanvasDemand(eligible);

  const showCones = eligible && canvasReady;

  return (
    <section className="thread-ground relative flex flex-col justify-between gap-10 overflow-hidden border border-ink/12 px-6 py-10 md:h-[520px] md:px-11 md:py-11">
      <div className="flex flex-col gap-2">
        <span className="font-sans text-[10px] uppercase tracking-label-wide text-saffron">
          {eyebrow}
        </span>
        <h2 className="font-display text-[32px] md:text-[44px]">{heading}</h2>
      </div>

      {/* The 3D shelf sits exactly over the poster row. */}
      {showCones && (
        <SceneView
          className="pointer-events-none absolute inset-x-0 bottom-[64px] h-[190px] md:bottom-[86px] md:h-[240px]"
          order={0}
          camera={CONE_CAMERA}
        >
          <ConeWallScene hovered={hovered} />
        </SceneView>
      )}

      <div
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
                className={cn(
                  "thread-bob block h-[104px] w-[58px] md:h-[132px] md:w-[74px]",
                  // The scene draws its own cones; hiding the poster underneath
                  // avoids two shelves in the same box.
                  showCones && "opacity-0"
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
