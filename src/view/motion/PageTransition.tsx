"use client";

import React from "react";
import { motion } from "framer-motion";
import { FABRIC_WIPE_GRADIENT, DURATION, EASE_SILK, prefersReducedMotion } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  if (prefersReducedMotion()) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full">
      {/* Saffron sweep panel */}
      <motion.div
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        exit={{ y: "0%" }}
        transition={{ duration: DURATION.wipe, ease: EASE_SILK }}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ background: FABRIC_WIPE_GRADIENT }}
      />
      {children}
    </div>
  );
};
