"use client";

/**
 * Velora name plate — the ONLY place the mark is drawn.
 * Replaces the hand-inlined `viewBox="0 0 100 124"` copies in Header, Footer,
 * MobileNav, VelLoader, AuthModal and checkout.
 *
 * The V is a full capital: ink fills the viewBox, ink height == the wordmark's
 * cap height, and the row is aligned on the BASELINE (items-baseline), not the
 * line box. See docs/BRAND.md.
 */

import React from "react";
import { cn } from "@/lib/utils";

export const VEL_BLADE =
  "M4 0 C 24 22 46 58 60 100 C 74 58 96 22 116 0 L 86 0 C 74 22 65 50 60 72 C 55 50 46 22 34 0 Z";
export const VEL_SPINE = "M60 6 L65 14 L60 66 L55 14 Z";
export const VEL_COLLAR = "M45 82 L75 82 L75 89 L45 89 Z";

/** Bodoni Moda cap height as a fraction of font-size. */
export const CAP_RATIO = 0.75;

type Tone = "cream" | "ink" | "saffron" | "mono";

const TONE: Record<Tone, { blade: string; accent: string; text: string; endorse: string }> = {
  cream:   { blade: "var(--color-saffron)",  accent: "var(--color-marigold)", text: "text-ink",     endorse: "text-ink/72" },
  ink:     { blade: "var(--color-panel)",    accent: "var(--color-marigold)", text: "text-panel",   endorse: "text-[var(--thread-lit)]" },
  saffron: { blade: "var(--color-panel)",    accent: "var(--color-turmeric)", text: "text-panel",   endorse: "text-turmeric" },
  mono:    { blade: "currentColor",          accent: "currentColor",          text: "",              endorse: "opacity-70" },
};

/** The vel mark alone. `size` is the ink height in px — pass the cap height of the type beside it. */
export const VelMark: React.FC<{ size: number; tone?: Tone; className?: string }> = ({
  size,
  tone = "cream",
  className,
}) => {
  const c = TONE[tone];
  return (
    <svg
      viewBox="0 0 120 100"
      width={size * 1.2}
      height={size}
      className={cn("block shrink-0", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d={VEL_BLADE} fill={c.blade} />
      <path d={VEL_SPINE} fill={c.accent} />
      {size >= 20 && <path d={VEL_COLLAR} fill={c.accent} />}
    </svg>
  );
};

interface WordmarkProps {
  /** Wordmark font-size in px. Header 30, footer 27, checkout 28, hero 68. */
  fontSize?: number;
  tone?: Tone;
  /** "by Priya Mahadevan" beneath. Always true in header and footer. */
  endorsement?: boolean;
  /** Stacked (endorsement below) or inline (endorsement to the right, divided). */
  layout?: "stacked" | "inline";
  className?: string;
}

export const Wordmark: React.FC<WordmarkProps> = ({
  fontSize = 30,
  tone = "cream",
  endorsement = true,
  layout = "stacked",
  className,
}) => {
  const c = TONE[tone];
  const cap = Math.round(fontSize * CAP_RATIO);
  const endorseSize = Math.max(7, Math.round(fontSize * 0.2));

  return (
    <span
      className={cn(
        "flex",
        layout === "stacked" ? "flex-col items-center" : "flex-row items-end gap-4",
        className
      )}
    >
      {/* items-baseline: apex lands on the cap line, tip lands on the baseline */}
      <span className="flex items-baseline">
        <VelMark size={cap} tone={tone} />
        <span
          className={cn(
            "font-display uppercase leading-[0.82] tracking-[0.28em] mr-[-0.28em]",
            c.text
          )}
          style={{ fontSize, marginLeft: Math.round(fontSize * 0.28) }}
        >
          elora
        </span>
      </span>

      {endorsement && (
        <span
          className={cn(
            "font-sans uppercase tracking-[0.34em] mr-[-0.34em] whitespace-nowrap",
            layout === "stacked" ? "mt-[5px]" : "pb-[3px]",
            c.endorse
          )}
          style={{ fontSize: endorseSize }}
        >
          by Priya Mahadevan
        </span>
      )}
    </span>
  );
};
