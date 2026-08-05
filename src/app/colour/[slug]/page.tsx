import React from "react";
import type { Metadata } from "next";
import { getColourCollectionVM } from "@/viewmodel/server/collection.viewmodel";
import { ColourKey } from "@/model/domain/types";
import { SareeGrid } from "@/view/components/SareeGrid";
import { ConeWall } from "@/view/components/ConeWall";
import { ThreadColour } from "@/view/thread/ThreadColour";
import { ThreadField } from "@/view/thread/ThreadField";
import { UI } from "@/content/ui";

interface ColourPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ColourPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vm = await getColourCollectionVM((slug || "maroon") as ColourKey);
  return {
    title: `${vm.colourData.label.en} sarees · Velora`,
    description: `Handpicked ${vm.colourData.label.en.toLowerCase()} sarees, chosen in Erode by Priya Mahadevan.`,
  };
}

/**
 * A colour room.
 *
 * The thread takes the hue on the way in and gives it back on the way out —
 * every filament, rule and card frame on the page bleeds over 900ms. Her
 * photographs are never colour-shifted: that would be lying about the product.
 */
export default async function ColourPage({ params }: ColourPageProps) {
  const { slug } = await params;
  const colourKey = (slug || "maroon") as ColourKey;
  const vm = await getColourCollectionVM(colourKey);

  return (
    <div className="flex w-full flex-col gap-14 px-4 pb-20 pt-6 md:gap-[64px] md:px-[60px]">
      <ThreadColour colour={colourKey} />

      <section className="thread-ground relative overflow-hidden border border-ink/12">
        <ThreadField variant="band" />
        <div className="relative z-10 flex flex-col gap-3 px-6 py-12 md:px-11 md:py-14">
          <span className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-label-wide text-ink/60">
            <span
              className="h-[18px] w-[18px] flex-shrink-0 rounded-full"
              style={{ backgroundColor: vm.colourData.hex }}
              aria-hidden
            />
            {vm.colourData.label.ta}
          </span>
          <h1 className="font-display text-[40px] leading-none md:text-[64px]">
            {vm.colourData.label.en}
          </h1>
        </div>
      </section>

      {vm.sarees.length > 0 ? (
        <SareeGrid sarees={vm.sarees} />
      ) : (
        <p className="py-16 text-center font-sans text-[15px] text-ink/70">
          {UI.emptyStates.generic(vm.colourData.label.en.toLowerCase())}
        </p>
      )}

      <ConeWall
        eyebrow={UI.colours.eyebrow}
        heading={UI.colours.heading}
        selected={colourKey}
      />
    </div>
  );
}
