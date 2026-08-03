import React from "react";
import Link from "next/link";
import { configFixture } from "@/model/fixtures/config.fixture";
import { OccasionKey } from "@/model/domain/types";

export const OccasionGrid: React.FC = () => {
  const occasions = Object.entries(configFixture.occasions) as [
    OccasionKey,
    { title: { en: string; ta: string }; description: { en: string; ta: string } }
  ][];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 my-8">
      {occasions.map(([key, data]) => (
        <Link
          key={key}
          href={`/occasion/${key}`}
          className="group relative aspect-[4/5] placeholder-weave p-6 flex flex-col justify-end overflow-hidden border border-[#241F1C]/10"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#241F1C]/80 via-[#241F1C]/20 to-transparent transition-opacity group-hover:opacity-90" />
          <div className="relative z-10 text-[#FDF4E4] flex flex-col gap-1">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#F8CE5A]">
              MOMENT
            </span>
            <h3 className="font-display text-[18px] md:text-[22px] font-normal group-hover:text-[#F8CE5A] transition-colors">
              {data.title.en}
            </h3>
            <p className="font-sans text-[11px] opacity-80 line-clamp-2">
              {data.description.en}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
