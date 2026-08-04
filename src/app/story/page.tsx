import React from "react";
import Image from "next/image";

export default function OurStoryPage() {
  return (
    <div className="bg-[#241F1C] text-[#FDF4E4] min-h-screen flex flex-col w-full">
      {/* D5 Header */}
      <div className="px-8 md:px-[64px] pt-[80px] pb-[56px] max-w-[900px] flex flex-col gap-[20px]">
        <span className="font-sans text-[11px] tracking-[0.34em] uppercase text-[#F5A623]">
          1977 — TODAY · ERODE
        </span>
        <h1 className="font-display text-[52px] md:text-[88px] leading-[0.98] text-[#FDF4E4]">
          My father taught me silk<br />before arithmetic.
        </h1>
        <div className="font-tamil text-[20px] text-[#FDF4E4]/75">
          என் தந்தை எனக்கு கற்பித்த பட்டு
        </div>
      </div>

      {/* D5 Panel 1: 1977 */}
      <div className="flex flex-col md:flex-row items-stretch border-t border-[#F5A623]/30">
        <div className="w-full md:w-[560px] h-[340px] md:h-[440px] bg-gradient-to-br from-[#4A423A] to-[#544A40] flex-shrink-0 border-b md:border-b-0 md:border-r border-[#F5A623]/30" />
        <div className="flex-1 p-8 md:p-[64px] md:py-[56px] flex flex-col justify-center gap-4">
          <span className="font-display text-[48px] md:text-[64px] leading-none text-[#F5A623]">1977</span>
          <h2 className="font-display text-[26px] md:text-[34px] leading-[1.2] text-[#FDF4E4]">
            A thousand square feet of silk.
          </h2>
          <p className="font-sans text-[14px] leading-[1.8] text-[#FDF4E4]/75 max-w-[520px]">
            My father, Mahadevan, opened his first shop with his brother beside him and very little else. He was no designer and never claimed to be one — he could tell you from the cloth between two fingers which loom it came off, and whether the zari would hold its colour after ten years folded in a steel trunk.
          </p>
        </div>
      </div>

      {/* D5 Panel 2: 1996 */}
      <div className="flex flex-col md:flex-row-reverse items-stretch border-t border-[#F5A623]/30">
        <div className="w-full md:w-[560px] h-[340px] md:h-[440px] bg-gradient-to-br from-[#5A4C3C] to-[#665441] flex-shrink-0 border-b md:border-b-0 md:border-l border-[#F5A623]/30" />
        <div className="flex-1 p-8 md:p-[64px] md:py-[56px] flex flex-col justify-center gap-4">
          <span className="font-display text-[48px] md:text-[64px] leading-none text-[#F5A623]">1996</span>
          <h2 className="font-display text-[26px] md:text-[34px] leading-[1.2] text-[#FDF4E4]">
            He sends me to the weavers alone.
          </h2>
          <p className="font-sans text-[14px] leading-[1.8] text-[#FDF4E4]/75 max-w-[520px]">
            I was nineteen. He never asked what I had bought — he would unfold it, hold it to the door light, and nod, or not nod. Thirty years later I am still buying the way he taught me.
          </p>
        </div>
      </div>

      {/* D5 Panel 3: 2026 */}
      <div className="flex flex-col md:flex-row items-stretch border-t border-[#F5A623]/30">
        <div className="relative w-full md:w-[560px] h-[340px] md:h-[440px] flex-shrink-0 border-b md:border-b-0 md:border-r border-[#F5A623]/30 overflow-hidden bg-[#3A3028]">
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
          <span className="font-display text-[48px] md:text-[64px] leading-none text-[#F5A623]">2026</span>
          <h2 className="font-display text-[26px] md:text-[34px] leading-[1.2] text-[#FDF4E4]">
            Velora.
          </h2>
          <p className="font-sans text-[14px] leading-[1.8] text-[#FDF4E4]/75 max-w-[520px]">
            The same hands, now reaching a woman in Bengaluru who will never stand at my counter. Every saree here is one I have held to the light myself, and there is only ever one of each.
          </p>
          <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#F5A623]/80 mt-2">
            Priya Mahadevan · Founder &amp; Curator · Erode, Tamil Nadu
          </span>
        </div>
      </div>
    </div>
  );
}
