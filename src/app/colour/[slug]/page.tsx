"use client";

import React, { use } from "react";
import Link from "next/link";
import { getColourCollectionVM } from "@/viewmodel/server/collection.viewmodel";
import { useColourDye } from "@/viewmodel/client/useColourDye";
import { ColourKey } from "@/model/domain/types";
import { SareeCard } from "@/view/components/SareeCard";
import { ColourStage } from "@/view/components/ColourStage";
import { configFixture } from "@/model/fixtures/config.fixture";

interface ColourPageProps {
  params: Promise<{ slug: string }>;
}

export default function ColourPage({ params }: ColourPageProps) {
  const resolvedParams = use(params);
  const colourKey = (resolvedParams.slug || "maroon") as ColourKey;

  const [vm, setVm] = React.useState<any>(null);

  React.useEffect(() => {
    getColourCollectionVM(colourKey).then(setVm);
  }, [colourKey]);

  useColourDye(colourKey);

  if (!vm) {
    return <div className="min-h-screen py-24 text-center">Loading collection...</div>;
  }

  const colours = Object.entries(configFixture.colours) as [
    ColourKey,
    { hex: string; label: { en: string; ta: string } }
  ][];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-14 flex flex-col items-center gap-8 text-center">
        <h1 className="font-display text-[44px] md:text-[64px] leading-none text-[var(--page-fg)]">
          Choose your colour
        </h1>

        {/* D2 Swatch Circle Selector */}
        <div className="flex gap-6 items-center flex-wrap justify-center my-2">
          {colours.map(([key, data]) => {
            const isSelected = key === colourKey;
            return (
              <Link key={key} href={`/colour/${key}`} className="flex flex-col items-center gap-2.5">
                <span className="flex h-[108px] w-[108px] items-center justify-center">
                <div
                  className={`rounded-full transition-all duration-300 shadow-none ${
                    isSelected ? "w-[104px] h-[104px]" : "w-[88px] h-[88px] hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: data.hex,
                    // Marigold, not the ground: on its own colour page the
                    // selected swatch and the dyed ground are the same hue.
                    boxShadow: isSelected
                      ? "0 0 0 2px var(--page-bg), 0 0 0 4px var(--color-marigold)"
                      : undefined,
                  }}
                />
                </span>
                <span className={`font-sans text-[10px] tracking-label uppercase text-[var(--page-fg)] ${isSelected ? "font-medium" : "opacity-70"}`}>
                  {key}
                </span>
              </Link>
            );
          })}
        </div>

      </div>

      {/* D2 · the cloth takes the dye */}
      <ColourStage
        hex={vm.colourData.hex}
        label={vm.colourData.label.en}
      />

      {/* Grid Header & Filters */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-4 w-full flex items-baseline justify-between">
        <h2 className="font-display text-[28px] md:text-[34px] text-[var(--page-fg)]">
          {vm.colourData.label.en} · {vm.sarees.length} sarees
        </h2>
        <div className="flex items-center gap-4 font-sans text-[11px] tracking-[0.18em] uppercase text-[var(--page-fg)] opacity-70">
          <span className="cursor-pointer hover:text-saffron">SILK</span>
          <span className="cursor-pointer hover:text-saffron">COTTON</span>
          <span className="cursor-pointer hover:text-saffron font-medium">NEWEST FIRST</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] pb-16 w-full">
        {vm.sarees.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {vm.sarees.map((saree: any) => (
              <SareeCard key={saree.id} saree={saree} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center font-display text-[20px] text-[var(--page-fg)] opacity-70">
            Nothing in {vm.colourData.label.en.toLowerCase()} this month — the next edit lands in early September.
          </div>
        )}
      </div>
    </div>
  );
}
