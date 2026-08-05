"use client";

/**
 * Every underline on the site is the thread arriving.
 *
 * Used under links, section heads and dividers. One easing everywhere:
 * cubic-bezier(.16, 1, .3, 1).
 */

import React from "react";
import { cn } from "@/lib/utils";
import { useSewn } from "./useSewn";

interface ThreadRuleProps {
  /** Draw on scroll-in. False renders it already drawn. */
  animate?: boolean;
  /** A soft temple hairline instead of a solid thread. */
  soft?: boolean;
  className?: string;
}

export const ThreadRule: React.FC<ThreadRuleProps> = ({
  animate = true,
  soft = false,
  className,
}) => {
  const [ref, sewn] = useSewn<HTMLDivElement>(0.4);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "h-px w-full origin-left",
        soft ? "rule-temple" : "bg-[var(--thread-lit)]",
        animate && sewn && "thread-draw",
        className
      )}
      style={animate && !sewn ? { transform: "scaleX(0)" } : undefined}
    />
  );
};
