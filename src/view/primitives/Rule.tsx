"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE_SILK } from "@/lib/motion";

interface RuleProps {
  className?: string;
  animate?: boolean;
}

export const Rule: React.FC<RuleProps> = ({ className, animate = true }) => {
  return animate ? (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: DURATION.draw, ease: EASE_SILK }}
      className={cn("rule-temple w-full origin-left", className)}
    />
  ) : (
    <div className={cn("rule-temple w-full", className)} />
  );
};
