import React from "react";
import type { Metadata } from "next";
import { getHomeViewModel } from "@/viewmodel/server/home.viewmodel";
import { SareeGrid } from "@/view/components/SareeGrid";
import { ConeWall } from "@/view/components/ConeWall";
import { ThreadField } from "@/view/thread/ThreadField";
import { UI } from "@/content/ui";

export const metadata: Metadata = {
  title: "All sarees · Velora",
  description:
    "Every saree in stock, handpicked in Erode by Priya Mahadevan. Filter by fabric or by colour.",
};

/**
 * The shop. One grid that behaves the same at six sarees and six hundred —
 * no count in the heading, no count in the copy, and LOAD MORE at the end.
 */
export default async function ShopPage() {
  const vm = await getHomeViewModel();

  return (
    <div className="flex w-full flex-col gap-14 px-4 pb-20 pt-6 md:gap-[64px] md:px-[60px]">
      <section className="thread-ground relative overflow-hidden border border-ink/12">
        <ThreadField variant="band" />
        <div className="relative z-10 flex flex-col gap-2 px-6 py-12 md:px-11 md:py-14">
          <span className="font-sans text-[10px] uppercase tracking-label-wide text-saffron">
            {UI.shop.eyebrow}
          </span>
          <h1 className="font-display text-[40px] leading-none md:text-[64px]">
            {UI.shop.heading}
          </h1>
        </div>
      </section>

      <SareeGrid sarees={vm.sarees} />

      <ConeWall eyebrow={UI.colours.eyebrow} heading={UI.colours.heading} />
    </div>
  );
}
