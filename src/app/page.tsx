import React from "react";
import Link from "next/link";
import { getHomeViewModel } from "@/viewmodel/server/home.viewmodel";
import { HeroThread } from "@/view/components/HeroThread";
import { SareeGrid } from "@/view/components/SareeGrid";
import { ConeWall } from "@/view/components/ConeWall";
import { OccasionGrid } from "@/view/components/OccasionGrid";
import { ThreadField } from "@/view/thread/ThreadField";
import { ThreadRule } from "@/view/thread/ThreadRule";
import { UI } from "@/content/ui";

export default async function HomePage() {
  const vm = await getHomeViewModel();

  return (
    <div className="flex w-full flex-col gap-16 px-4 pb-20 md:gap-[64px] md:px-[60px] md:pt-6">
      <HeroThread />

      {/* 02 · The shop. A grid, not a deck — identical at six items and six hundred. */}
      <section className="thread-ground-flat flex flex-col gap-8 border border-ink/12 px-6 py-10 md:px-11 md:py-11">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[10px] uppercase tracking-label-wide text-saffron">
              {UI.shop.eyebrow}
            </span>
            <h2 className="font-display text-[32px] md:text-[44px]">{UI.shop.heading}</h2>
          </div>
        </div>

        <SareeGrid sarees={vm.sarees} />
      </section>

      {/* 03 · Browse by colour — the weaver's shelf. */}
      <ConeWall
        eyebrow={UI.colours.eyebrow}
        heading={UI.colours.heading}
      />

      {/* Shop by occasion */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[28px] md:text-[38px]">{UI.occasions.heading}</h2>
          <span className="font-sans text-[10px] uppercase tracking-label text-ink/55">
            {UI.occasions.subline}
          </span>
        </div>
        <ThreadRule soft />
        <OccasionGrid />
      </section>

      {/* The curator. Her lineage is the anchor, so it sits above the social proof. */}
      <section className="relative overflow-hidden border border-ink/12 bg-panel">
        <ThreadField variant="band" className="opacity-70" />
        <div className="relative z-10 flex flex-col gap-10 px-6 py-12 md:flex-row md:items-center md:gap-14 md:px-11 md:py-14">
          <div className="placeholder-weave h-[280px] w-full flex-shrink-0 border border-ink/15 md:h-[380px] md:w-[300px]" />

          <div className="flex flex-col gap-5">
            <span className="font-sans text-[10px] uppercase tracking-label-wide text-saffron">
              {UI.curatorQuote.eyebrow}
            </span>
            <blockquote className="m-0 max-w-[680px] font-display text-[24px] leading-[1.3] md:text-[34px]">
              {UI.curatorQuote.quote}
            </blockquote>
            <p className="m-0 font-tamil text-[17px] text-ink/75">{UI.curatorQuote.tamilQuote}</p>
            <span className="font-sans text-[10px] uppercase tracking-label text-ink/60">
              {UI.curatorQuote.attribution}
            </span>
            <Link
              href="/story"
              className="group flex w-fit flex-col gap-1.5 font-sans text-[12px] uppercase tracking-[0.16em] text-ink hover:text-saffron"
            >
              {UI.legacy.readStory}
              <span className="h-px w-full origin-left bg-[var(--thread-lit)] transition-transform duration-500 ease-silk group-hover:scale-x-100" />
            </Link>
          </div>
        </div>
      </section>

      {/* Worn by you */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[28px] md:text-[38px]">{UI.instagram.heading}</h2>
          <span className="font-sans text-[10px] uppercase tracking-label text-ink/55">
            {UI.instagram.subline}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-3.5">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="placeholder-weave aspect-square border border-ink/10" />
          ))}
        </div>
      </section>
    </div>
  );
}
