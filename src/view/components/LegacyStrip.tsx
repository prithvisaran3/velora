import React from "react";
import { TamilText } from "../primitives/TamilText";

export const LegacyStrip: React.FC = () => {
  return (
    <section className="bg-[#241F1C] text-[#FDF4E4] py-10 md:py-14 px-6 md:px-16 my-8">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#F5A623]">
            CHOSEN IN ERODE, SINCE 1977
          </span>
          <h3 className="font-display text-[22px] md:text-[32px] font-normal">
            Three generations of silk handpicking.
          </h3>
          <TamilText className="text-[13px] text-[#FDF4E4]/70">
            49 ஆண்டுகளாக ஈரோட்டில் தேர்ந்தெடுக்கப்பட்ட பட்டு.
          </TamilText>
        </div>

        <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-[#F5A623]/35 pt-4 md:pt-0 md:pl-8">
          <div className="flex flex-col">
            <span className="font-display text-[28px] md:text-[36px] text-[#F8CE5A]">49</span>
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-80">Years in Silk</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[28px] md:text-[36px] text-[#F8CE5A]">3</span>
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-80">Generations</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[28px] md:text-[36px] text-[#F8CE5A]">100%</span>
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-80">Pure Silk</span>
          </div>
        </div>
      </div>
    </section>
  );
};
