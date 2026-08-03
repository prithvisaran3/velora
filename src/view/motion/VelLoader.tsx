"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOADER, FABRIC_WIPE_GRADIENT, prefersReducedMotion } from "@/lib/motion";

export const VelLoader: React.FC = () => {
  const [stage, setStage] = useState<"draw" | "close" | "fill" | "wipe" | "done">("draw");

  useEffect(() => {
    if (prefersReducedMotion()) {
      const timer = setTimeout(() => setStage("done"), 200);
      return () => clearTimeout(timer);
    }

    const t1 = setTimeout(() => setStage("close"), LOADER.drawEnd);
    const t2 = setTimeout(() => setStage("fill"), LOADER.closeEnd);
    const t3 = setTimeout(() => setStage("wipe"), LOADER.fillEnd);
    const t4 = setTimeout(() => setStage("done"), LOADER.revealEnd);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (stage === "done") return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF4E4] overflow-hidden">
        {/* Authentic Vel Logo Mark SVG */}
        <div className="relative flex flex-col items-center gap-3 z-10">
          <svg className="w-20 h-24" viewBox="0 0 100 124" fill="none">
            {/* Beat 1 & 2: Saffron Blade Path */}
            <motion.path
              d="M6 8 C 21 30 39 68 50 116 C 61 68 79 30 94 8 L 77 8 C 67 28 56 58 50 84 C 44 58 33 28 23 8 Z"
              stroke="#E8621B"
              strokeWidth="3"
              fill={stage === "fill" || stage === "wipe" ? "#E8621B" : "none"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Beat 2: Marigold Spine & Collar */}
            {(stage === "close" || stage === "fill" || stage === "wipe") && (
              <>
                <motion.path
                  d="M50 12 L55 19 L50 78 L45 19 Z"
                  fill="#F5A623"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.16 }}
                />
                <motion.path
                  d="M37 91 L63 91 L63 98 L37 98 Z"
                  fill="#F5A623"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.16 }}
                />
              </>
            )}
          </svg>

          <span className="font-sans text-[9px] tracking-[0.34em] uppercase text-[#241F1C]/70">
            BY BHARANI PATTU
          </span>
        </div>

        {/* Beat 4: Saffron Fabric Wipe Panel */}
        {stage === "wipe" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ background: FABRIC_WIPE_GRADIENT }}
          />
        )}
      </div>
    </AnimatePresence>
  );
};
