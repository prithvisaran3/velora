import React from "react";
import Image from "next/image";
import { UI } from "@/content/ui";

export default function OurStoryPage() {
  return (
    <div className="bg-ink text-cream min-h-screen flex flex-col w-full">
      {/* D5 Header */}
      <div className="px-8 md:px-[64px] pt-[80px] pb-[56px] max-w-[900px] flex flex-col gap-[20px]">
        <span className="font-sans text-[11px] tracking-[0.34em] uppercase text-marigold">
          {UI.story.eyebrow}
        </span>
        <h1 className="font-display text-[52px] md:text-[88px] leading-[0.98] text-cream" dangerouslySetInnerHTML={{ __html: UI.story.heading.replace('<br />', '<br/>') }} />
        <div className="font-tamil text-[20px] text-cream/75">
          {UI.story.tamilHeading}
        </div>
      </div>

      {/* D5 Panel 1: 1977 */}
      <div className="flex flex-col md:flex-row items-stretch border-t border-marigold/30">
        <div 
          className="w-full md:w-[560px] h-[340px] md:h-[440px] flex-shrink-0 border-b md:border-b-0 md:border-r border-marigold/30"
          style={{ background: "linear-gradient(to bottom right, #4A423A, #544A40)" }}
        />
        <div className="flex-1 p-8 md:p-[64px] md:py-[56px] flex flex-col justify-center gap-4">
          <span className="font-display text-[48px] md:text-[64px] leading-none text-marigold">{UI.story.panels[0].year}</span>
          <h2 className="font-display text-[26px] md:text-[34px] leading-[1.2] text-cream">
            {UI.story.panels[0].title}
          </h2>
          <p className="font-sans text-[14px] leading-[1.8] text-cream/75 max-w-[520px]">
            {UI.story.panels[0].body}
          </p>
        </div>
      </div>

      {/* D5 Panel 2: 1996 */}
      <div className="flex flex-col md:flex-row-reverse items-stretch border-t border-marigold/30">
        <div 
          className="w-full md:w-[560px] h-[340px] md:h-[440px] flex-shrink-0 border-b md:border-b-0 md:border-l border-marigold/30"
          style={{ background: "linear-gradient(to bottom right, #5A4C3C, #665441)" }}
        />
        <div className="flex-1 p-8 md:p-[64px] md:py-[56px] flex flex-col justify-center gap-4">
          <span className="font-display text-[48px] md:text-[64px] leading-none text-marigold">{UI.story.panels[1].year}</span>
          <h2 className="font-display text-[26px] md:text-[34px] leading-[1.2] text-cream">
            {UI.story.panels[1].title}
          </h2>
          <p className="font-sans text-[14px] leading-[1.8] text-cream/75 max-w-[520px]">
            {UI.story.panels[1].body}
          </p>
        </div>
      </div>

      {/* D5 Panel 3: 2026 */}
      <div className="flex flex-col md:flex-row items-stretch border-t border-marigold/30">
        <div 
          className="relative w-full md:w-[560px] h-[340px] md:h-[440px] flex-shrink-0 border-b md:border-b-0 md:border-r border-marigold/30 overflow-hidden"
          style={{ backgroundColor: "#3A3028" }}
        >
          <Image
            src="/photo/priya.jpeg"
            alt="Priya Mahadevan at her Erode counter"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 560px"
            priority
          />
        </div>
        <div className="flex-1 p-8 md:p-[64px] md:py-[56px] flex flex-col justify-center gap-4">
          <span className="font-display text-[48px] md:text-[64px] leading-none text-marigold">{UI.story.panels[2].year}</span>
          <h2 className="font-display text-[26px] md:text-[34px] leading-[1.2] text-cream">
            {UI.story.panels[2].title}
          </h2>
          <p className="font-sans text-[14px] leading-[1.8] text-cream/75 max-w-[520px]">
            {UI.story.panels[2].body}
          </p>
          <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-marigold/80 mt-2">
            {UI.story.signature} · {UI.story.signatureTitle}
          </span>
        </div>
      </div>
    </div>
  );
}
