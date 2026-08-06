"use client";

/**
 * 01 · The hero.
 *
 * Six filaments drifting on long, offset cycles, with light running along each
 * one at its own speed. That travelling glint is what makes it read as spun
 * gold rather than a drawn line — and it is SVG, so it is present in the first
 * paint and can never delay a product image.
 *
 * The saree is not here. It is never animated: it is only ever a still
 * photograph, and the first one is in the grid below.
 */

import React from "react";
import Link from "next/link";
import { ThreadField } from "../thread/ThreadField";
import { useMediaQuery } from "../thread/useMediaQuery";
import { UI } from "@/content/ui";

/** Below this the hero box is portrait and the wide field squashes. */
const PORTRAIT = "(max-width: 767px)";
/**
 * Where the wide field starts winning.
 *
 * Distortion is |scaleY / scaleX|. On a 900-tall hero the 1348 box is square-on
 * at 1576px and the 2200 box at 2572px, so the two are equally wrong at
 * sqrt(1576 × 2572) ≈ 2013 — below that the desktop set is still the better
 * drawing, above it the wide one is. Measured, not guessed: at 1920 the wide
 * set reads 1.34 against the desktop set's 0.82.
 */
const ULTRA_WIDE = "(min-width: 2000px)";

export const HeroThread: React.FC = () => {
  // One field, chosen — not three hidden by CSS. The desktop set is what the
  // server renders, so the threads are in the first paint either way.
  const portrait = useMediaQuery(PORTRAIT);
  const ultraWide = useMediaQuery(ULTRA_WIDE);
  const variant = portrait ? "heroMobile" : ultraWide ? "heroWide" : "hero";

  // The live-marker only means anything where there is a cursor to follow, and
  // it is a pulse — so a coarse pointer or reduced motion gets no marker at
  // all rather than a still ring making a promise the page will not keep.
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const showMarker = finePointer && !reducedMotion;

  return (
  /* The hero IS the page: full bleed, no border, no seam, and it owns the
     first screen. `data-hero` is what the header watches to decide whether it
     is overlaying the thread ground or sitting on its own solid band. */
  <section
    data-hero
    className="thread-ground relative flex min-h-[min(100svh,900px)] flex-col overflow-hidden"
    // The header is sticky, so it occupies flow. Pulling the hero up by exactly
    // its height puts the thread ground under the nav — the nav floats on the
    // cloth instead of sitting in a band above it, and the padding-top below
    // keeps the headline clear of it.
    style={{ marginTop: "calc(var(--header-h) * -1)" }}
  >
    <ThreadField variant={variant} interactive />

    {/* The header overlays the top of this box, so the hero reserves its
        height rather than letting the nav land on the headline. */}
    <div
      className="measure relative z-10 flex flex-1 flex-col pb-10 md:pb-14"
      style={{ paddingTop: "var(--header-h)" }}
    >
      {/* A zero-height anchor, so the marker hangs off the measure's own inner
          edge rather than a gutter value repeated in this file. */}
      {showMarker && (
        <div className="relative h-0" aria-hidden>
          <div className="pointer-events-none absolute right-0 top-3 flex flex-col items-center gap-2.5">
            <span className="relative block h-6 w-6">
              {/* The ring that leaves. */}
              <span className="thread-pulse absolute inset-0 block rounded-full border border-[var(--thread)]" />
              {/* The one that stays. */}
              <span className="absolute inset-0 block rounded-full border border-[var(--thread)] opacity-60" />
            </span>
            <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-label text-ink/45">
              {UI.hero.liveMarker}
            </span>
          </div>
        </div>
      )}

      {/* Optically centred in whatever is left between nav and buttons. */}
      <div className="flex flex-1 flex-col justify-center gap-7 py-10">
        <div className="flex flex-col">
          {/* pb inside the clip box, not on the box: the descender of
              "was held first." must never be shaved by overflow-hidden. */}
          <span className="block overflow-hidden pb-[0.06em]">
            <h1 className="thread-rise m-0 whitespace-nowrap pb-[0.16em] font-display text-[clamp(2.5rem,9vw,6.75rem)] leading-none">
              {UI.hero.headlineTop}
            </h1>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span
              className="thread-rise block whitespace-nowrap pb-[0.18em] font-display text-[clamp(2.5rem,9vw,6.75rem)] italic leading-none text-saffron"
              style={{ animationDelay: "0.12s" }}
            >
              {UI.hero.headlineBottom}
            </span>
          </span>
        </div>

        <p
          className="thread-fade max-w-[470px] font-sans text-[14px] leading-[1.9] text-ink/70"
          style={{ animationDelay: "0.8s" }}
        >
          {UI.hero.subline}
        </p>
      </div>

      {/* Pinned bottom — this is what removes the dead band under the CTAs. */}
      <div className="flex flex-none flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="thread-fade flex flex-wrap gap-3.5" style={{ animationDelay: "1s" }}>
          <Link
            href="/shop"
            className="relative overflow-hidden bg-saffron px-8 py-5 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-panel transition-all duration-500 ease-silk hover:-translate-y-[3px] hover:bg-pressed hover:shadow-[0_16px_26px_-12px_rgba(120,84,40,0.7)] md:px-10"
          >
            {UI.hero.ctaPrimary}
            <span
              className="thread-glint pointer-events-none absolute inset-y-0 w-[30%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,240,214,0.32), transparent)",
              }}
              aria-hidden
            />
          </Link>
          <Link
            href="/colour/maroon"
            className="border border-ink/30 px-7 py-[19px] font-sans text-[11px] uppercase tracking-[0.24em] transition-all duration-500 ease-silk hover:border-saffron hover:tracking-[0.3em] hover:text-saffron md:px-8"
          >
            {UI.hero.ctaSecondary}
          </Link>
        </div>

        <div className="hidden flex-shrink-0 flex-col items-center gap-2 md:flex" aria-hidden>
          <span className="font-sans text-[9.5px] uppercase tracking-[0.28em] text-ink/50">
            {UI.hero.scroll}
          </span>
          <span className="thread-hint block h-[26px] w-px bg-saffron" />
        </div>
      </div>
    </div>
  </section>
  );
};
