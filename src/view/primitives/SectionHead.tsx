/**
 * The v9 section head, in one place.
 *
 * Mono 11px at 0.3em in saffron over a Bodoni title. Every band on the site
 * uses it, so the eyebrow/title relationship is a single decision rather than
 * eight slightly different ones drifting apart in eight page files.
 *
 * `as` exists because a page may only have one h1: page-head bands pass "h1",
 * sections below keep the default h2.
 */

import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  /** Tamil or English support line under the title. */
  subtitle?: React.ReactNode;
  as?: "h1" | "h2";
  /** Page-head bands run larger than sections further down. */
  size?: "page" | "section";
  /** On an ink ground the eyebrow has to be the lit strand, not saffron. */
  onInk?: boolean;
  className?: string;
}

export const SectionHead: React.FC<SectionHeadProps> = ({
  eyebrow,
  title,
  subtitle,
  as: Heading = "h2",
  size = "section",
  onInk = false,
  className,
}) => (
  <div className={cn("flex flex-col gap-2", className)}>
    {eyebrow && (
      <span
        className={cn(
          "font-mono text-[11px] uppercase tracking-label-wide",
          onInk ? "text-[var(--thread-lit)]" : "text-saffron"
        )}
      >
        {eyebrow}
      </span>
    )}
    <Heading
      className={cn(
        "font-display leading-[1.04]",
        size === "page" ? "text-[40px] md:text-[64px]" : "text-[32px] md:text-[44px]"
      )}
    >
      {title}
    </Heading>
    {subtitle}
  </div>
);
