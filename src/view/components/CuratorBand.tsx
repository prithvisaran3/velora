import React from "react";
import { TamilText } from "../primitives/TamilText";
import { UI } from "@/content/ui";

export const CuratorBand: React.FC = () => {
  return (
    <section className="bg-sand py-12 md:py-16 px-6 md:px-16 my-12">
      <div className="max-w-[840px] mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="w-24 h-24 md:w-32 md:w-32 rounded-full placeholder-weave flex-shrink-0 border-2 border-saffron/20" />
        <div className="flex flex-col gap-3">
          <span className="font-sans text-[10px] uppercase tracking-label-wide text-ink/55">
            {UI.curatorQuote.eyebrow}
          </span>
          <blockquote className="font-display text-[18px] md:text-[22px] text-ink leading-relaxed italic">
            {UI.curatorQuote.quote}
          </blockquote>
          <TamilText className="text-[13px] text-ink/75">
            {UI.curatorQuote.tamilQuote}
          </TamilText>
          <span className="font-sans text-[11px] uppercase tracking-label font-medium text-ink/78 mt-1">
            {UI.curatorQuote.attribution}
          </span>
        </div>
      </div>
    </section>
  );
};
