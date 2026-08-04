"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { LOADER, FABRIC_WIPE_GRADIENT, prefersReducedMotion } from "@/lib/motion";
import { SceneView } from "@/three/SceneView";
import { requestEarlyCanvas } from "@/three/boot";
import { THREE_FLAGS } from "@/three/flags";
import { getTier, tierAllows } from "@/three/tier";
import { LOADER_CAMERA } from "@/three/scenes/velLoader/camera";
import { cn } from "@/lib/utils";

const VelLoaderScene = dynamic(
  () => import("@/three/scenes/velLoader/Scene").then((mod) => mod.VelLoaderScene),
  { ssr: false, loading: () => null }
);

type Stage = "draw" | "close" | "fill" | "wipe" | "done";

const SEEN_KEY = "velora_vel_loader_3d";

/**
 * 01 · Vel loader.
 *
 * The 2D stroke-draw mark is the poster and it paints at t0, always. On a
 * first visit to a `high` device the extruded mark takes over inside the same
 * box and the stage goes to ink; if the shared context has not produced a
 * frame by the end of the turn (260ms) the 3D is abandoned outright and the
 * poster simply finishes its own timeline. Either way the loader is gone at
 * 900ms.
 */
export const VelLoader: React.FC = () => {
  const [stage, setStage] = useState<Stage>("draw");
  const [use3D, setUse3D] = useState(false);
  const [sceneLive, setSceneLive] = useState(false);
  const abandonTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onFirstFrame = useCallback(() => {
    if (abandonTimer.current) {
      clearTimeout(abandonTimer.current);
      abandonTimer.current = null;
    }
    setSceneLive(true);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const timer = setTimeout(() => setStage("done"), 200);
      return () => clearTimeout(timer);
    }

    const eligible =
      THREE_FLAGS.velLoader &&
      tierAllows(getTier(), "velLoader") &&
      sessionStorage.getItem(SEEN_KEY) === null;

    if (eligible) {
      sessionStorage.setItem(SEEN_KEY, "1");
      // The canvas is allowed to exist early only here — see three/boot.ts.
      requestEarlyCanvas();
      document.documentElement.style.setProperty("--velora-canvas-z", "60");
      setUse3D(true);
      abandonTimer.current = setTimeout(() => setUse3D(false), LOADER.drawEnd);
    }

    const timers = [
      setTimeout(() => setStage("close"), LOADER.drawEnd),
      setTimeout(() => setStage("fill"), LOADER.closeEnd),
      setTimeout(() => setStage("wipe"), LOADER.fillEnd),
      setTimeout(() => setStage("done"), LOADER.revealEnd),
    ];

    return () => {
      timers.forEach(clearTimeout);
      if (abandonTimer.current) clearTimeout(abandonTimer.current);
    };
  }, []);

  useEffect(() => {
    if (stage !== "done") return;
    document.documentElement.style.setProperty("--velora-canvas-z", "5");
  }, [stage]);

  if (stage === "done") return null;

  const dark = use3D;
  // On the ink stage the secondary goes turmeric, per docs/BRAND.md §Colour.
  const accent = dark ? "var(--color-turmeric)" : "var(--color-marigold)";

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-colors duration-300",
          dark ? "bg-ink" : "bg-cream"
        )}
      >
        <div className="relative flex flex-col items-center gap-3">
          {/* One box for both: the scene replaces the poster with no shift. */}
          <div className="relative flex h-[134px] w-[160px] items-center justify-center">
            {use3D && (
              <SceneView
                className="absolute inset-0"
                order={0}
                camera={LOADER_CAMERA}
              >
                <VelLoaderScene onFirstFrame={onFirstFrame} />
              </SceneView>
            )}

            <svg
              className={cn(
                "h-[50px] w-[60px] transition-opacity duration-200",
                sceneLive ? "opacity-0" : "opacity-100"
              )}
              viewBox="0 0 120 100"
              fill="none"
              aria-hidden
            >
              <motion.path
                d="M4 0 C 24 22 46 58 60 100 C 74 58 96 22 116 0 L 86 0 C 74 22 65 50 60 72 C 55 50 46 22 34 0 Z"
                stroke="var(--color-saffron)"
                strokeWidth="2.5"
                fill={
                  stage === "fill" || stage === "wipe"
                    ? "var(--color-saffron)"
                    : "none"
                }
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              />

              {(stage === "close" || stage === "fill" || stage === "wipe") && (
                <>
                  <motion.path
                    d="M60 6 L65 14 L60 66 L55 14 Z"
                    fill={accent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.16 }}
                  />
                  <motion.path
                    d="M45 82 L75 82 L75 89 L45 89 Z"
                    fill={accent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.16 }}
                  />
                </>
              )}
            </svg>
          </div>

          <span
            className={cn(
              "endorsement text-[9px]",
              dark ? "text-cream/70" : "text-ink/70"
            )}
          >
            by Priya Mahadevan
          </span>
        </div>
      </div>

      {/* Above the canvas, so the wipe covers the stage as well as the page. */}
      {stage === "wipe" && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[70]"
          style={{ background: FABRIC_WIPE_GRADIENT }}
        />
      )}
    </>
  );
};
