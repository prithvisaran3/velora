"use client";

import React from "react";
import { motion } from "framer-motion";
import { revealVariants, prefersReducedMotion } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className }) => {
  if (prefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
};
