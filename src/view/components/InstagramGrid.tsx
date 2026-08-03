import React from "react";
import { SectionHead } from "../primitives/SectionHead";

export const InstagramGrid: React.FC = () => {
  return (
    <section className="my-12 px-4 md:px-16">
      <SectionHead align="center" subtitle="Follow @velora.in on Instagram for drape loops and loom stories.">
        From our Showroom
      </SectionHead>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mt-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="aspect-square placeholder-weave border border-[#241F1C]/10 flex items-center justify-center text-[#241F1C]/40 text-[10px] font-sans uppercase tracking-widest"
          >
            @{idx}
          </div>
        ))}
      </div>
    </section>
  );
};
