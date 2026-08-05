"use client";

/**
 * A running stitch instead of a spinner. It is the only loader on the site.
 *
 * No 3D, no canvas, no font dependency — it paints at t0 from CSS alone, which
 * is the whole reason it replaced the extruded mark: a loader that has to wait
 * for a WebGL context is not a loader.
 */

import React from "react";
import { cn } from "@/lib/utils";

interface ThreadLoaderProps {
  /** Shown under the stitch. Keep it short and sentence case. */
  label?: string;
  className?: string;
}

export const ThreadLoader: React.FC<ThreadLoaderProps> = ({ label, className }) => (
  <div
    className={cn("flex w-full flex-col items-center justify-center gap-4 py-16", className)}
    role="status"
    aria-live="polite"
  >
    <svg viewBox="0 0 376 40" className="h-10 w-[240px]" aria-hidden focusable="false">
      <path
        d="M2 20 C 60 4, 120 36, 188 20 C 256 4, 316 36, 374 20"
        fill="none"
        stroke="var(--thread)"
        strokeWidth="2.5"
        strokeDasharray="28 28"
        className="thread-run"
      />
    </svg>
    {label && (
      <span className="font-sans text-[10px] uppercase tracking-label-wide text-ink/55">
        {label}
      </span>
    )}
    <span className="sr-only">Loading</span>
  </div>
);

/** Full-height variant for a route that has nothing to show yet. */
export const ThreadLoaderPage: React.FC<{ label?: string }> = ({ label }) => (
  <div className="flex min-h-[60vh] w-full items-center justify-center">
    <ThreadLoader label={label} />
  </div>
);
