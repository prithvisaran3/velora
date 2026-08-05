"use client";

/**
 * Checkout progress. Bag → address → payment → done.
 *
 * The thread sews forward one segment per step. No measuring and no observer:
 * the sewn length is a percentage, so it survives any container width and any
 * number of steps.
 */

import React from "react";
import { cn } from "@/lib/utils";

interface ThreadStepperProps {
  steps: readonly string[];
  /** Zero-based index of the step being worked on. */
  current: number;
  className?: string;
}

export const ThreadStepper: React.FC<ThreadStepperProps> = ({
  steps,
  current,
  className,
}) => {
  const last = Math.max(steps.length - 1, 1);
  const reached = Math.min(Math.max(current, 0), last);
  const percent = (reached / last) * 100;

  return (
    <div
      className={cn("w-full py-2", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-valuenow={reached + 1}
      aria-valuetext={`Step ${reached + 1} of ${steps.length}: ${steps[reached]}`}
    >
      <div className="relative">
        {/* The unsewn run, and the thread that has reached this far. */}
        <div className="absolute left-0 right-0 top-[7px] h-px bg-ink/18" aria-hidden />
        <div
          className="absolute left-0 top-[6px] h-[2px] bg-[var(--thread)] transition-[width] duration-draw ease-silk"
          style={{ width: `${percent}%` }}
          aria-hidden
        />

        <ol className="relative flex items-start justify-between">
          {steps.map((step, index) => {
            const done = index <= reached;
            return (
              <li key={step} className="flex flex-1 flex-col items-center gap-2 first:items-start last:items-end">
                <span
                  className={cn(
                    "h-[15px] w-[15px] flex-shrink-0 rounded-full transition-colors duration-hover",
                    done ? "bg-saffron" : "border border-ink/30 bg-[var(--page-bg)]"
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "font-sans text-[9px] uppercase tracking-label md:text-[10px]",
                    done ? "text-ink" : "text-ink/50"
                  )}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
