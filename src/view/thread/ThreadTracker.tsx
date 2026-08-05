"use client";

/**
 * Order tracking. Placed → packed → shipped → out → delivered.
 *
 * A cross-stitch, sewn shut on arrival. Replaces the zari stepper: same
 * behaviour, drawn by the thread instead of a two-tone weave, and it follows
 * `--thread` like everything else.
 *
 * The ceremony only runs on the visit where the status actually changed —
 * `lastSeenStatus` in localStorage sees to that, scoped by order reference so
 * two orders animate independently and a refresh does not re-run it.
 */

import React, { useEffect, useState } from "react";
import { STEPPER_STATES, type OrderStatus } from "@/model/domain/types";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ThreadTrackerProps {
  currentStatus: OrderStatus;
  /** Scopes `lastSeenStatus` so two orders animate independently. */
  reference?: string;
  className?: string;
}

const LABELS: Record<OrderStatus, string> = {
  pending: "Placed",
  paid: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const STORAGE_PREFIX = "velora_stepper_seen:";

/** The zigzag itself, in a 100 × 8 box stretched to whatever width it lands in. */
function crossStitch(fromPercent: number, toPercent: number, stitches: number): string {
  const span = toPercent - fromPercent;
  if (span <= 0) return "";
  const step = span / stitches;
  let d = `M ${fromPercent} 6`;
  for (let i = 0; i < stitches; i += 1) {
    d += ` L ${fromPercent + step * (i + 0.5)} ${i % 2 === 0 ? 1 : 7}`;
    d += ` L ${fromPercent + step * (i + 1)} ${i % 2 === 0 ? 7 : 1}`;
  }
  return d;
}

export const ThreadTracker: React.FC<ThreadTrackerProps> = ({
  currentStatus,
  reference,
  className,
}) => {
  const currentIdx = STEPPER_STATES.indexOf(currentStatus);
  const activeStep = currentIdx === -1 ? 0 : currentIdx;
  const last = STEPPER_STATES.length - 1;

  /** Segments at or below this index are already known and never re-sew. */
  const [seenStep, setSeenStep] = useState(activeStep);

  useEffect(() => {
    const key = `${STORAGE_PREFIX}${reference ?? "default"}`;
    let previous = activeStep;
    try {
      const stored = window.localStorage.getItem(key);
      const index = stored ? STEPPER_STATES.indexOf(stored as OrderStatus) : -1;
      previous = index === -1 ? -1 : index;
      window.localStorage.setItem(key, STEPPER_STATES[activeStep]);
    } catch {
      // Private mode: fall back to no animation rather than to a broken page.
    }
    setSeenStep(prefersReducedMotion() ? activeStep : previous);
  }, [activeStep, reference]);

  const activePercent = (activeStep / last) * 100;
  const seenPercent = (Math.max(seenStep, 0) / last) * 100;
  const isNew = seenStep < activeStep;

  // Everything already known is simply there; only the new run is sewn in.
  const settled = crossStitch(0, isNew ? seenPercent : activePercent, Math.max(seenStep, 0) * 3 || 1);
  const arriving = isNew ? crossStitch(seenPercent, activePercent, (activeStep - Math.max(seenStep, 0)) * 3) : "";

  return (
    <div className={cn("w-full py-4", className)}>
      {/* Desktop — horizontal, sewn left to right */}
      <div className="relative hidden md:block">
        <svg
          viewBox="0 0 100 8"
          preserveAspectRatio="none"
          className="absolute left-0 top-[4px] h-2 w-full"
          aria-hidden
        >
          <line x1="0" y1="6" x2="100" y2="6" stroke="rgba(36,31,28,0.18)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {settled && (
            <path d={settled} fill="none" stroke="var(--thread)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          )}
          {arriving && (
            <path
              d={arriving}
              fill="none"
              stroke="var(--thread)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              style={{
                // @ts-expect-error -- --len is read by the thread-stitch keyframe.
                "--len": 400,
                strokeDasharray: 400,
                animation: "thread-stitch 2s 0.3s var(--ease-silk) both",
              }}
            />
          )}
        </svg>

        <ol className="relative flex items-start justify-between pt-[2px]">
          {STEPPER_STATES.map((step, index) => (
            <li key={step} className="flex flex-col items-center gap-2 first:items-start last:items-end">
              <Node reached={index <= activeStep} active={index === activeStep} />
              <span
                className={cn(
                  "whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.16em]",
                  index <= activeStep ? "font-medium text-ink" : "text-ink/50"
                )}
              >
                {LABELS[step]}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile — vertical, the thread runs down the left */}
      <div className="relative flex flex-col gap-6 px-2 md:hidden">
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-ink/18" aria-hidden />
        <div
          className="absolute left-[8px] top-2 w-[2px] bg-[var(--thread)] transition-[height] duration-draw ease-silk"
          style={{ height: `calc(${(activeStep / last) * 100}% - 1rem)` }}
          aria-hidden
        />
        <ol className="flex flex-col gap-6">
          {STEPPER_STATES.map((step, index) => (
            <li key={step} className="relative z-10 flex items-center gap-4">
              <Node reached={index <= activeStep} active={index === activeStep} />
              <span
                className={cn(
                  "font-sans text-[12px] uppercase tracking-[0.16em]",
                  index <= activeStep ? "font-medium text-ink" : "text-ink/50"
                )}
              >
                {LABELS[step]}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const Node: React.FC<{ reached: boolean; active: boolean }> = ({ reached, active }) => (
  <span
    aria-hidden
    className={cn(
      "h-[15px] w-[15px] flex-shrink-0 rounded-full transition-all duration-300",
      active
        ? "bg-saffron ring-4 ring-saffron/20"
        : reached
        ? "bg-[var(--thread)]"
        : "border border-ink/30 bg-[var(--page-bg)]"
    )}
  />
);
