import React from "react";

export default function OurStoryPage() {
  return (
    <div className="bg-[#241F1C] text-[#FDF4E4] min-h-screen flex flex-col w-full">
      {/* D5 Header */}
      <div className="px-8 md:px-[64px] pt-[80px] pb-[56px] max-w-[900px] flex flex-col gap-[20px]">
        <span className="font-sans text-[11px] tracking-[0.34em] uppercase text-[#F5A623]">
          1978 — TODAY
        </span>
        <h1 className="font-display text-[52px] md:text-[88px] leading-[0.98] text-[#FDF4E4]">
          Three generations,<br />one shop.
        </h1>
        <div className="font-tamil text-[20px] text-[#FDF4E4]/75">
          ஈரோட்டில் மூன்று தலைமுறைகள்
        </div>
      </div>

      {/* D5 Panel 1: 1978 */}
      <div className="flex flex-col md:flex-row items-stretch border-t border-[#F5A623]/30">
        <div className="w-full md:w-[560px] h-[340px] md:h-[440px] bg-gradient-to-br from-[#4A423A] to-[#544A40] flex items-end p-4 border-b md:border-b-0 md:border-r border-[#F5A623]/30 flex-shrink-0">
          <span className="font-mono text-[10px] text-[#FDF4E4]/60">archival 1978 · sepia, heavy grain</span>
        </div>
        <div className="flex-1 p-8 md:p-[64px] md:py-[56px] flex flex-col justify-center gap-4">
          <span className="font-display text-[48px] md:text-[64px] leading-none text-[#F5A623]">1978</span>
          <h2 className="font-display text-[26px] md:text-[34px] leading-[1.2] text-[#FDF4E4]">
            A ten-foot shop on Brough Road
          </h2>
          <p className="font-sans text-[14px] leading-[1.8] text-[#FDF4E4]/75 max-w-[520px]">
            My grandfather sold nine-yard cottons to mill workers. He kept the stock on two shelves and the accounts in his head.
          </p>
        </div>
      </div>

      {/* D5 Panel 2: 1996 */}
      <div className="flex flex-col md:flex-row-reverse items-stretch border-t border-[#F5A623]/30">
        <div className="w-full md:w-[560px] h-[340px] md:h-[440px] bg-gradient-to-br from-[#5A4C3C] to-[#665441] flex items-end p-4 border-b md:border-b-0 md:border-l border-[#F5A623]/30 flex-shrink-0">
          <span className="font-mono text-[10px] text-[#FDF4E4]/60">1996 · warm mid-tone, light grain</span>
        </div>
        <div className="flex-1 p-8 md:p-[64px] md:py-[56px] flex flex-col justify-center gap-4">
          <span className="font-display text-[48px] md:text-[64px] leading-none text-[#F5A623]">1996</span>
          <h2 className="font-display text-[26px] md:text-[34px] leading-[1.2] text-[#FDF4E4]">
            My mother takes the counter
          </h2>
          <p className="font-sans text-[14px] leading-[1.8] text-[#FDF4E4]/75 max-w-[520px]">
            She moved the house into silk and started travelling to Kanchipuram herself. Every saree on this site is still chosen by her.
          </p>
        </div>
      </div>

      {/* D5 Panel 3: 2026 */}
      <div className="flex flex-col md:flex-row items-stretch border-t border-[#F5A623]/30">
        <div className="w-full md:w-[560px] h-[340px] md:h-[440px] placeholder-weave flex items-end p-4 border-b md:border-b-0 md:border-r border-[#F5A623]/30 flex-shrink-0">
          <span className="font-mono text-[10px] text-[#241F1C]/65">2026 · full colour, no grain</span>
        </div>
        <div className="flex-1 p-8 md:p-[64px] md:py-[56px] flex flex-col justify-center gap-4">
          <span className="font-display text-[48px] md:text-[64px] leading-none text-[#F5A623]">2026</span>
          <h2 className="font-display text-[26px] md:text-[34px] leading-[1.2] text-[#FDF4E4]">
            Velora
          </h2>
          <p className="font-sans text-[14px] leading-[1.8] text-[#FDF4E4]/75 max-w-[520px]">
            The same hands, the same shop, now reaching a woman in Bengaluru who will never walk down Brough Road.
          </p>
          <span className="font-mono text-[10px] text-[#FDF4E4]/50 mt-2">
            grain opacity and sepia filter animate to 0 as each panel enters · 900ms
          </span>
        </div>
      </div>
    </div>
  );
}
