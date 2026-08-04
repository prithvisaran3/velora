"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SceneView } from "@/three/SceneView";
import { useCanvasReady, useThreeTier } from "@/three/CanvasProvider";
import { THREE_FLAGS } from "@/three/flags";
import { tierAllows } from "@/three/tier";
import { useCanvasDemand } from "@/three/useCanvasDemand";
import { DYE_CAMERA } from "@/three/scenes/heroCloth/camera";

const DYE_CLOTH_SIZE: readonly [number, number] = [4.8, 3];
const DYE_CLOTH_POSITION: readonly [number, number, number] = [0, 0.42, 0];

const HeroClothScene = dynamic(
  () => import("@/three/scenes/heroCloth/Scene").then((mod) => mod.HeroClothScene),
  { ssr: false, loading: () => null }
);

/**
 * 03 · The cloth dyes, not the CSS.
 *
 * One mesh for the whole of /colour/[slug]. Picking a hue lerps its base and
 * sheen over 800ms while the page ground follows on `--page-bg`; the zari mask
 * is untouched, so gold stays gold through every colour. Nothing is downloaded
 * between hues.
 *
 * Poster: the same band as a flat gradient in the hue — which is exactly what
 * a no-JS visitor and the `low` tier see.
 */
export const ColourStage: React.FC<{ hex: string; label: string }> = ({
  hex,
  label,
}) => {
  const tier = useThreeTier();
  const canvasReady = useCanvasReady();

  const eligible = THREE_FLAGS.colourDye && tierAllows(tier, "colourDye");
  useCanvasDemand(eligible);

  const showCloth = eligible && canvasReady;

  return (
    <section className="relative w-full h-[320px] md:h-[420px] overflow-hidden border-y border-ink/10">
      <div
        className="absolute inset-0 transition-[background] duration-dye ease-silk"
        style={{
          background: `linear-gradient(118deg, ${hex} 0%, ${hex} 42%, rgba(36,31,28,0.35) 100%)`,
        }}
      />
      <div className="absolute inset-y-0 left-[14%] w-[8px] zari-weave opacity-50" />

      {showCloth && (
        <SceneView className="absolute inset-0" order={0} camera={DYE_CAMERA}>
          <HeroClothScene
            hex={hex}
            halfGrid={tier === "mid"}
            size={DYE_CLOTH_SIZE}
            position={DYE_CLOTH_POSITION}
          />
        </SceneView>
      )}

      <span className="absolute bottom-5 left-6 md:left-[64px] z-10 font-sans text-[10px] tracking-label-wide uppercase text-cream/80">
        {label} · pure silk, dyed and woven
      </span>
    </section>
  );
};
