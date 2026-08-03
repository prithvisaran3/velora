import React from "react";
import { TamilText } from "../primitives/TamilText";

export const CuratorBand: React.FC = () => {
  return (
    <section className="bg-[#F6EAD6] py-12 md:py-16 px-6 md:px-16 my-12">
      <div className="max-w-[840px] mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="w-24 h-24 md:w-32 md:w-32 rounded-full placeholder-weave flex-shrink-0 border-2 border-[#E8621B]/20" />
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#241F1C]/55">
            CURATOR'S NOTE
          </span>
          <blockquote className="font-display text-[18px] md:text-[22px] text-ink leading-relaxed italic">
            "A saree should feel unhurried. When you wear Velora, you carry forty-eight years of Erode silk house heritage on your shoulder."
          </blockquote>
          <TamilText className="text-[13px] text-[#241F1C]/75">
            பாரம்பரிய நெசவின் அழகு, ஒவ்வொரு இழையிலும் மிளிர்கிறது.
          </TamilText>
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium text-[#241F1C]/78 mt-1">
            — Bharani Pattu Family House, Erode
          </span>
        </div>
      </div>
    </section>
  );
};
