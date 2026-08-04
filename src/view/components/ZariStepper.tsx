"use client";

import React from "react";
import { OrderStatus, STEPPER_STATES } from "@/model/domain/types";
import { cn } from "@/lib/utils";

interface ZariStepperProps {
  currentStatus: OrderStatus;
  className?: string;
}

export const ZariStepper: React.FC<ZariStepperProps> = ({ currentStatus, className }) => {
  const currentIdx = STEPPER_STATES.indexOf(currentStatus as any);
  const activeStepIndex = currentIdx === -1 ? 0 : currentIdx;

  const stateLabels: Record<string, string> = {
    paid: "Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
  };

  return (
    <div className={cn("w-full py-6", className)}>
      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:flex items-center justify-between relative w-full px-4">
        {/* Background Track */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-ink/14 -translate-y-1/2 z-0" />
        
        {/* Progress Gold Zari Track */}
        <div
          className="absolute top-1/2 left-8 h-1 zari-weave -translate-y-1/2 z-0 transition-all duration-draw ease-silk"
          style={{ width: `calc(${(activeStepIndex / (STEPPER_STATES.length - 1)) * 100}% - 4rem)` }}
        />

        {STEPPER_STATES.map((step, idx) => {
          const isReached = idx <= activeStepIndex;
          const isActive = idx === activeStepIndex;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "rounded-full transition-all duration-300 flex items-center justify-center bg-cream",
                  isActive
                    ? "w-[19px] h-[19px] bg-saffron ring-4 ring-saffron/20"
                    : isReached
                    ? "w-[15px] h-[15px] bg-marigold"
                    : "w-[15px] h-[15px] border border-ink/30 bg-transparent"
                )}
              />
              <span
                className={cn(
                  "font-sans text-[11px] uppercase tracking-[0.16em] text-center",
                  isReached ? "text-ink font-medium" : "text-ink/50"
                )}
              >
                {stateLabels[step]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="flex md:hidden flex-col gap-6 relative px-2">
        <div className="absolute left-[13px] top-3 bottom-3 w-1 bg-ink/14 z-0" />
        <div
          className="absolute left-[13px] top-3 w-1 zari-weave-vertical z-0 transition-all duration-draw ease-silk"
          style={{ height: `${(activeStepIndex / (STEPPER_STATES.length - 1)) * 80}%` }}
        />

        {STEPPER_STATES.map((step, idx) => {
          const isReached = idx <= activeStepIndex;
          const isActive = idx === activeStepIndex;

          return (
            <div key={step} className="relative z-10 flex items-center gap-4">
              <div
                className={cn(
                  "rounded-full transition-all duration-300 flex-shrink-0 bg-cream",
                  isActive
                    ? "w-[17px] h-[17px] bg-saffron ring-4 ring-saffron/20"
                    : isReached
                    ? "w-[13px] h-[13px] bg-marigold"
                    : "w-[13px] h-[13px] border border-ink/30 bg-transparent"
                )}
              />
              <span
                className={cn(
                  "font-sans text-[12px] uppercase tracking-[0.16em]",
                  isReached ? "text-ink font-medium" : "text-ink/50"
                )}
              >
                {stateLabels[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
