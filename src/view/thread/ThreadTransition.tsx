"use client";

/**
 * The page transition.
 *
 * The thread whips across, the DOM swaps behind it, it unstitches. 780ms.
 * No fade, no panel — the page underneath is never hidden, so nothing about
 * this can delay a product image.
 */

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/lib/motion";

const WHIP_MS = 780;
const PATH_LENGTH = 440;

export const ThreadTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [run, setRun] = useState(0);
  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (first) {
      setFirst(false);
      return;
    }
    if (prefersReducedMotion()) return;
    setRun((n) => n + 1);
    const timer = setTimeout(() => setRun(0), WHIP_MS);
    return () => clearTimeout(timer);
    // The whip is triggered by the route, not by anything inside it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {run > 0 && (
        <svg
          key={run}
          viewBox="0 0 376 40"
          preserveAspectRatio="none"
          className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[40px] w-full"
          aria-hidden
        >
          <path
            d="M-10 20 C 80 -8, 130 48, 200 20 C 270 -8, 320 48, 386 20"
            fill="none"
            stroke="var(--color-saffron)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            style={{
              // @ts-expect-error -- --len is read by the thread-stitch keyframe.
              "--len": PATH_LENGTH,
              strokeDasharray: PATH_LENGTH,
              animation: `thread-stitch ${WHIP_MS / 2}ms var(--ease-silk) alternate 2`,
            }}
          />
        </svg>
      )}
      {children}
    </>
  );
};
