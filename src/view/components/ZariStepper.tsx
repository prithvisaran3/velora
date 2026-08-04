"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { OrderStatus, STEPPER_STATES } from "@/model/domain/types";
import { DURATION, EASE_SILK_CSS, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ZariStepperProps {
  currentStatus: OrderStatus;
  /** Scopes `lastSeenStatus` so two orders animate independently. */
  reference?: string;
  className?: string;
}

const LABELS: Record<string, string> = {
  pending: "Placed",
  paid: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

const DRAW_MS = DURATION.draw * 1000;
const HALF = DRAW_MS / 2;
const STORAGE_PREFIX = "velora_stepper_seen:";

/**
 * 06b · The zari stepper.
 *
 * SVG, not 3D. Each newly completed segment is woven in: the marigold warp
 * draws first, then the turmeric weft crosses it on a 7px dash, and what is
 * left is exactly the two-tone weave from the brand. 900ms per segment, and
 * only on the visit where the status actually changed — `lastSeenStatus` in
 * localStorage sees to that, so a page refresh does not re-run the ceremony.
 */
const ZariThread: React.FC<{
  length: number;
  vertical?: boolean;
  animate: boolean;
  delay: number;
}> = ({ length, vertical = false, animate, delay }) => {
  const [drawn, setDrawn] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setDrawn(true), 20);
    return () => clearTimeout(timer);
  }, [animate]);

  const x2 = vertical ? 0 : length;
  const y2 = vertical ? length : 0;
  const offset = drawn ? 0 : length;

  return (
    <g>
      {/* Warp — the thread that runs the length of the segment. */}
      <line
        x1={0}
        y1={0}
        x2={x2}
        y2={y2}
        stroke="var(--color-marigold)"
        strokeWidth={4}
        strokeDasharray={length}
        strokeDashoffset={offset}
        style={
          animate
            ? {
                transition: `stroke-dashoffset ${HALF}ms ${EASE_SILK_CSS} ${delay}ms`,
              }
            : undefined
        }
      />
      {/* Weft — crosses it 7px on, 7px off, which leaves the woven two-tone. */}
      <line
        x1={0}
        y1={0}
        x2={x2}
        y2={y2}
        stroke="var(--color-turmeric)"
        strokeWidth={4}
        strokeDasharray="7 7"
        strokeDashoffset={drawn ? 0 : length}
        style={
          animate
            ? {
                transition: `stroke-dashoffset ${HALF}ms ${EASE_SILK_CSS} ${delay + HALF}ms`,
              }
            : undefined
        }
      />
    </g>
  );
};

export const ZariStepper: React.FC<ZariStepperProps> = ({
  currentStatus,
  reference,
  className,
}) => {
  const currentIdx = STEPPER_STATES.indexOf(currentStatus);
  const activeStep = currentIdx === -1 ? 0 : currentIdx;

  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  /** Segments at or below this index are already known and never animate. */
  const [seenStep, setSeenStep] = useState(activeStep);

  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;
    const read = () => setWidth(el.clientWidth);
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const nodes = STEPPER_STATES.length;
  const inset = 34;
  const span = Math.max(width - inset * 2, 1);
  const gap = span / (nodes - 1);

  return (
    <div ref={container} className={cn("w-full py-6", className)}>
      {/* Desktop — horizontal */}
      <div className="relative hidden md:block">
        <svg
          width="100%"
          height="12"
          viewBox={`0 0 ${Math.max(width, 1)} 12`}
          className="absolute left-0 top-[9px]"
          aria-hidden
        >
          <line
            x1={inset}
            y1={6}
            x2={width - inset}
            y2={6}
            stroke="rgba(36,31,28,0.14)"
            strokeWidth={4}
          />
          {STEPPER_STATES.slice(0, -1).map((step, idx) => {
            if (idx >= activeStep) return null;
            const animate = idx >= seenStep;
            return (
              <g key={step} transform={`translate(${inset + gap * idx}, 6)`}>
                <ZariThread
                  length={gap}
                  animate={animate}
                  delay={animate ? (idx - Math.max(seenStep, 0)) * 160 : 0}
                />
              </g>
            );
          })}
        </svg>

        <div className="relative flex items-start justify-between px-[26px]">
          {STEPPER_STATES.map((step, idx) => (
            <div key={step} className="relative z-10 flex w-[16px] flex-col items-center gap-2">
              <Node reached={idx <= activeStep} active={idx === activeStep} />
              <span
                className={cn(
                  "whitespace-nowrap font-sans text-[11px] uppercase tracking-[0.16em]",
                  idx <= activeStep ? "text-ink font-medium" : "text-ink/50"
                )}
              >
                {LABELS[step]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile — vertical */}
      <div className="relative flex flex-col gap-6 px-2 md:hidden">
        <svg
          width="12"
          height="100%"
          viewBox="0 0 12 400"
          preserveAspectRatio="none"
          className="absolute left-[9px] top-0 h-full"
          aria-hidden
        >
          <line x1={6} y1={10} x2={6} y2={390} stroke="rgba(36,31,28,0.14)" strokeWidth={4} />
        </svg>

        {STEPPER_STATES.map((step, idx) => (
          <div key={step} className="relative z-10 flex items-center gap-4">
            <Node reached={idx <= activeStep} active={idx === activeStep} small />
            <span
              className={cn(
                "font-sans text-[12px] uppercase tracking-[0.16em]",
                idx <= activeStep ? "text-ink font-medium" : "text-ink/50"
              )}
            >
              {LABELS[step]}
            </span>
          </div>
        ))}
        <div
          className="absolute left-[11px] top-3 w-1 zari-weave-vertical transition-[height] duration-draw ease-silk"
          style={{ height: `${(activeStep / (nodes - 1)) * 82}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
};

const Node: React.FC<{ reached: boolean; active: boolean; small?: boolean }> = ({
  reached,
  active,
  small = false,
}) => (
  <div
    className={cn(
      "flex-shrink-0 rounded-full bg-cream transition-all duration-300",
      active
        ? small
          ? "h-[17px] w-[17px] bg-saffron ring-4 ring-saffron/20"
          : "h-[19px] w-[19px] bg-saffron ring-4 ring-saffron/20"
        : reached
        ? small
          ? "h-[13px] w-[13px] bg-marigold"
          : "h-[15px] w-[15px] bg-marigold"
        : small
        ? "h-[13px] w-[13px] border border-ink/30 bg-transparent"
        : "h-[15px] w-[15px] border border-ink/30 bg-transparent"
    )}
  />
);
