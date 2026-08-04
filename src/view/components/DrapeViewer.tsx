"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SceneView } from "@/three/SceneView";
import { useCanvasReady, useThreeTier } from "@/three/CanvasProvider";
import { THREE_FLAGS } from "@/three/flags";
import { tierAllows } from "@/three/tier";
import { DRAPE_CAMERA } from "@/three/scenes/pdpDrape/camera";

const PdpDrapeScene = dynamic(
  () => import("@/three/scenes/pdpDrape/Scene").then((mod) => mod.PdpDrapeScene),
  { ssr: false, loading: () => null }
);

interface DrapeViewerProps {
  hex: string;
  title: string;
}

/**
 * 04 · Walk around the drape.
 *
 * Sits below the flat-lay hero and loads only once it is on screen, so it can
 * never be part of the product image's critical path. The poster is a draped
 * still in CSS with the same border geometry — it is what a no-JS visitor, a
 * `low` device and a reduced-motion visitor get, in the same box.
 */
export const DrapeViewer: React.FC<DrapeViewerProps> = ({ hex, title }) => {
  const tier = useThreeTier();
  const canvasReady = useCanvasReady();
  const [seen, setSeen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [seen]);

  const showDrape =
    THREE_FLAGS.pdpDrape && canvasReady && seen && tierAllows(tier, "pdpDrape");

  return (
    <div
      ref={container}
      className="relative h-[420px] md:h-[560px] w-full overflow-hidden border-t border-ink/10 drape-stage"
    >
      {/* Poster — a draped still, in CSS. It fades out once the scene has a
          frame up, so the two are never on screen together. */}
      <div
        className={`absolute left-1/2 top-1/2 h-[300px] w-[150px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-crossfade ease-silk md:h-[400px] md:w-[200px] ${
          showDrape ? "opacity-0" : "opacity-100"
        }`}
        style={{
          background: `repeating-linear-gradient(170deg, ${hex} 0 16px, rgba(36,31,28,0.28) 16px 30px)`,
          borderRight: "3px solid var(--color-marigold)",
          borderLeft: "3px solid var(--color-marigold)",
        }}
        aria-hidden
      />

      {showDrape && (
        <SceneView
          className="absolute inset-0"
          order={1}
          camera={DRAPE_CAMERA}
        >
          <PdpDrapeScene hex={hex} />
        </SceneView>
      )}

      <span className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 font-sans text-[10px] tracking-label-wide uppercase text-cream/70">
        {showDrape ? "Drag to turn · hold to magnify" : `${title} · draped`}
      </span>
    </div>
  );
};
