import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { UI } from "@/content/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Her story · Velora",
  description:
    "Priya Mahadevan learned silk behind her father's counter in Erode from 1977. Every saree here is one she has held to the light.",
};

/** Panel grounds, until her photographs land. The last one is real. */
const PANEL_GROUND = [
  "linear-gradient(140deg, #4A423A, #544A40)",
  "linear-gradient(140deg, #5A4C3C, #665441)",
  "#3A3028",
];

/**
 * Her lineage is the anchor of the whole site, so this page is the one place
 * the thread goes quiet: ink ground, gold years, and nothing moving except the
 * reader.
 */
export default function OurStoryPage() {
  return (
    <div className="flex w-full flex-col bg-ink text-panel">
      <header className="measure flex flex-col gap-5 pb-14 pt-16 md:pt-20">
        <span className="endorsement text-[11px] text-[var(--thread-lit)]">
          {UI.story.eyebrow}
        </span>
        <h1 className="max-w-[900px] font-display text-[44px] leading-[0.98] md:text-[84px]">
          {UI.story.heading}
        </h1>
        <p className="m-0 font-tamil text-[20px] text-panel/75">{UI.story.tamilHeading}</p>
      </header>

      {UI.story.panels.map((panel, index) => {
        const flipped = index % 2 === 1;
        const isLast = index === UI.story.panels.length - 1;
        return (
          <section
            key={panel.year}
            className={cn(
              "flex items-stretch border-t border-[var(--thread)]/30",
              flipped ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"
            )}
          >
            <div
              className={cn(
                "relative h-[300px] w-full flex-shrink-0 overflow-hidden border-b border-[var(--thread)]/30 md:h-[440px] md:w-[560px] md:border-b-0",
                flipped ? "md:border-l" : "md:border-r"
              )}
              style={{ background: PANEL_GROUND[index] }}
            >
              {isLast && (
                <Image
                  src="/photo/priya.jpeg"
                  alt="Priya Mahadevan at her Erode counter"
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover object-center"
                />
              )}
            </div>

            <div className="flex flex-1 flex-col justify-center gap-4 p-8 md:p-[60px]">
              <span className="font-display text-[44px] leading-none text-[var(--thread-lit)] md:text-[64px]">
                {panel.year}
              </span>
              <h2 className="font-display text-[26px] leading-[1.2] md:text-[34px]">
                {panel.title}
              </h2>
              <p className="m-0 max-w-[520px] font-sans text-[14px] leading-[1.8] text-panel/75">
                {panel.body}
              </p>
              {isLast && (
                <span className="mt-2 font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--thread-lit)]/80">
                  {UI.story.signature} · {UI.story.signatureTitle}
                </span>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
