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
        {/* Vel Mark SVG beats */}
        <div className="relative w-24 h-24 flex items-center justify-center z-10">
          <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
            {/* Blade outline draw */}
            <motion.path
              d="M30 80 L50 20 L70 80"
              stroke="#E8621B"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stage !== "draw" ? 1 : 0.8 }}
              transition={{ duration: 0.26 }}
            />
            {/* Marigold spine + collar */}
            {(stage === "close" || stage === "fill" || stage === "wipe") && (
              <motion.path
                d="M50 20 L50 80"
                stroke="#F5A623"
                strokeWidth="3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.16 }}
              />
            )}
            {/* Saffron fill flood */}
            {(stage === "fill" || stage === "wipe") && (
              <motion.path
                d="M30 80 L50 20 L70 80 Z"
                fill="#E8621B"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              />
            )}
          </svg>
        </div>

        {/* Saffron fabric wipe panel */}
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
