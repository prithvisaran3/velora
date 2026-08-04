"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SceneView } from "@/three/SceneView";
import { useCanvasReady, useThreeTier } from "@/three/CanvasProvider";
import { THREE_FLAGS } from "@/three/flags";
import { tierAllows } from "@/three/tier";
import {
  HERO_CAMERA,
  HERO_HEX,
  HERO_LAYOUT_NARROW,
  HERO_LAYOUT_WIDE,
} from "@/three/scenes/heroCloth/camera";

const HeroClothScene = dynamic(
  () => import("@/three/scenes/heroCloth/Scene").then((mod) => mod.HeroClothScene),
  { ssr: false, loading: () => null }
);

/**
 * 02 · The hero.
 *
 * The poster is a woven silk ground in CSS — it is what renders with JS off,
 * and it is what the scene has to match. The cloth swaps into the identical
 * box, so there is no shift, and it is weighted right of centre so the fold
 * never runs under the headline.
 */
export const HeroStage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const tier = useThreeTier();
  const canvasReady = useCanvasReady();
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const layout = wide ? HERO_LAYOUT_WIDE : HERO_LAYOUT_NARROW;

  const showCloth =
    THREE_FLAGS.heroCloth && canvasReady && tierAllows(tier, "heroCloth");

  return (
    <section className="relative w-full h-[660px] overflow-hidden border-b border-ink/15 flex items-end">
      {/* Poster — CSS only, no JS required. */}
      <div className="hero-silk absolute inset-0" />
      <div className="absolute inset-y-0 right-[6%] w-[8px] zari-weave opacity-30 md:opacity-25" />

      {/* The scene needs no top clip: the sticky header sits at z-40 and the
          canvas at z-5, so the header always paints over it. */}
      {showCloth && (
        <SceneView className="absolute inset-0" order={0} camera={HERO_CAMERA}>
          <HeroClothScene
            hex={HERO_HEX}
            halfGrid={tier === "mid"}
            size={layout.size}
            position={layout.position}
            sheenGain={0.4}
          />
        </SceneView>
      )}

      <div className="relative z-10 max-w-[840px] flex flex-col gap-[26px] p-8 md:p-[64px]">
        {children}
      </div>
    </section>
  );
};
