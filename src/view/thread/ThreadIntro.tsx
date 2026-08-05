"use client";

/**
 * First visit only, and gone by 900ms.
 *
 * The thread's last act is to sew the vel's spine — the logo is the end of the
 * stitch. There is no WebGL here and nothing to download: it is SVG and CSS,
 * so it paints at t0 and can never sit in front of the first product image.
 */

import React, { useEffect, useState } from "react";
import { VEL_BLADE, VEL_SPINE } from "@/view/primitives/Wordmark";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SEEN_KEY = "velora_thread_intro";
const SPINE_LENGTH = 130;
const TOTAL_MS = 900;
const FADE_AT_MS = 620;

export const ThreadIntro: React.FC = () => {
  const [phase, setPhase] = useState<"hidden" | "sewing" | "leaving">("hidden");

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) !== null;
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private mode: skip the intro rather than run it on every navigation.
    }
    if (seen || prefersReducedMotion()) return;

    setPhase("sewing");
    const timers = [
      setTimeout(() => setPhase("leaving"), FADE_AT_MS),
      setTimeout(() => setPhase("hidden"), TOTAL_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center bg-[var(--page-bg)] transition-opacity duration-[280ms] ease-silk",
        phase === "leaving" ? "opacity-0" : "opacity-100"
      )}
      aria-hidden
    >
      <div className="flex flex-col items-center gap-3">
        <span className="flex items-baseline">
          <svg viewBox="0 0 120 100" className="h-[52px] w-[62px] shrink-0" focusable="false">
            <path d={VEL_BLADE} fill="var(--color-ink)" />
            <path
              d={VEL_SPINE}
              fill="none"
              stroke="var(--thread)"
              strokeWidth="3"
              style={{
                // @ts-expect-error -- --len is read by the thread-stitch keyframe.
                "--len": SPINE_LENGTH,
                strokeDasharray: SPINE_LENGTH,
                animation: "thread-stitch 420ms 80ms var(--ease-silk) both",
              }}
            />
          </svg>
          <span
            className="wordmark ml-[15px] text-[52px] text-ink"
            style={{ animation: "thread-fade 420ms 120ms var(--ease-silk) both" }}
          >
            elora
          </span>
        </span>
        <span
          className="endorsement text-[9px] text-ink/70"
          style={{ animation: "thread-fade 420ms 260ms var(--ease-silk) both" }}
        >
          by Priya Mahadevan
        </span>
      </div>
    </div>
  );
};
