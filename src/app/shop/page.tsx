import React from "react";
import type { Metadata } from "next";
import { getHomeViewModel } from "@/viewmodel/server/home.viewmodel";
import { SareeGrid } from "@/view/components/SareeGrid";
import { ConeWall } from "@/view/components/ConeWall";
import { ThreadField } from "@/view/thread/ThreadField";
import { SectionHead } from "@/view/primitives/SectionHead";
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
    <div className="flex w-full flex-col gap-14 pb-20 md:gap-[64px]">
      {/* Full-bleed ground; only the text keeps the measure. */}
      <section className="thread-ground relative overflow-hidden">
        <ThreadField variant="band" />
        <div className="measure relative z-10 py-12 md:py-14">
          <SectionHead
            eyebrow={UI.shop.eyebrow}
            title={UI.shop.heading}
            as="h1"
            size="page"
          />
        </div>
      </section>

      <div className="measure">
        <SareeGrid sarees={vm.sarees} />
      </div>

      <ConeWall eyebrow={UI.colours.eyebrow} heading={UI.colours.heading} />
    </div>
  );
}
