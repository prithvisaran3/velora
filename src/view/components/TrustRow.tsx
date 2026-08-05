import React from "react";
import { cn } from "@/lib/utils";

/**
 * The trust signals stay visible: authenticity, return window, COD, GST and
 * the delivery window. They are the reason a first-time buyer finishes.
 */
const ITEMS = [
  "HANDPICKED IN ERODE",
  "7-DAY RETURN",
  "COD AVAILABLE",
  "GST INVOICE",
  "SHIPS ACROSS INDIA 3–6 DAYS",
] as const;

export const TrustRow: React.FC<{ onInk?: boolean; className?: string }> = ({
  onInk = false,
  className,
}) => (
  <div className={cn("no-scrollbar w-full overflow-x-auto", className)}>
    <div
      className={cn(
        "flex min-w-max items-center gap-5 font-sans text-[10px] uppercase tracking-label md:gap-6 md:text-[11px]",
        onInk ? "text-panel/75" : "text-ink/75"
      )}
    >
      {ITEMS.map((item, index) => (
        <React.Fragment key={item}>
          <span>{item}</span>
          {index < ITEMS.length - 1 && (
            <span className="text-[var(--thread-lit)]" aria-hidden>
              ·
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);
