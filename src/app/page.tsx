import React from "react";
import Link from "next/link";
import { getHomeViewModel } from "@/viewmodel/server/home.viewmodel";
import { Button } from "@/view/primitives/Button";
import { SareeCard } from "@/view/components/SareeCard";
import { OccasionGrid } from "@/view/components/OccasionGrid";
import { configFixture } from "@/model/fixtures/config.fixture";
import { ColourKey } from "@/model/domain/types";
import { UI } from "@/content/ui";

export default async function HomePage() {
  const vm = await getHomeViewModel();

  const colours = Object.entries(configFixture.colours) as [
    ColourKey,
    { hex: string; label: { en: string; ta: string } }
  ][];

  return (
    <div className="flex flex-col w-full bg-cream">
      {/* D1 Hero Section */}
      <section className="relative w-full h-[660px] placeholder-weave flex items-end p-8 md:p-[64px] overflow-hidden border-b border-ink/15">
        <div className="relative z-10 max-w-[840px] flex flex-col gap-[26px]">
          <h1 className="font-display text-[52px] md:text-[104px] text-ink leading-[0.94] text-balance">
            {UI.hero.headline}
          </h1>
          <p className="font-sans text-[15px] md:text-[16px] text-ink/80 max-w-[520px] leading-[1.7]">
            {UI.hero.subline}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/saree/deep-maroon-mangai-zari-silk">
              <Button variant="primary">{UI.hero.ctaPrimary}</Button>
            </Link>
            <Link href="/colour/maroon">
              <Button variant="secondary">{UI.hero.ctaSecondary}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* D1 Legacy Strip */}
      <section className="bg-ink text-cream px-8 md:px-[64px] py-[44px] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="font-display text-[32px] md:text-[38px] text-cream leading-[1.1]">
          Chosen in Erode,<br />since 1977.
        </div>
        <div className="flex items-center gap-10 md:gap-14">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-display text-[34px] text-marigold">{UI.legacyStrip.years}</span>
            <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-cream/65">{UI.legacyStrip.yearsLabel}</span>
          </div>
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-display text-[34px] text-marigold">{UI.legacyStrip.generations}</span>
            <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-cream/65">{UI.legacyStrip.generationsLabel}</span>
          </div>
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-display text-[34px] text-marigold">48</span>
            <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-cream/65">SAREES A MONTH</span>
          </div>
        </div>
      </section>

      {/* D1 Shop by Occasion */}
      <section className="px-8 md:px-[64px] py-[72px] flex flex-col gap-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[32px] md:text-[44px] text-ink">Shop by occasion</h2>
          <span className="font-sans text-[11px] tracking-label uppercase text-ink/60">CURATED FOR YOUR EVENT</span>
        </div>
        <OccasionGrid />
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-marigold to-transparent mx-[64px]" />

      {/* D1 Shop by Colour */}
      <section className="px-8 md:px-[64px] py-[72px] flex flex-col md:flex-row gap-12 md:gap-[64px] items-center">
        <div className="flex flex-col gap-5 max-w-[400px]">
          <h2 className="font-display text-[36px] md:text-[44px] leading-[1.05] text-ink">Browse by<br/>colour palette</h2>
          <p className="font-sans text-[14px] leading-[1.75] text-ink/78">
            How sarees are actually chosen. Pick a colour and browse the full collection in that hue — from deep maroon bridal silks to everyday kora cottons.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 flex-1 justify-center md:justify-start">
          {colours.map(([key, data]) => (
            <Link key={key} href={`/colour/${key}`} className="flex flex-col items-center gap-2.5 group">
              <div
                className="w-[88px] h-[88px] md:w-[96px] md:h-[96px] rounded-full border border-ink/10 group-hover:scale-105 transition-transform shadow-none"
                style={{ backgroundColor: data.hex }}
              />
              <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-ink/70 group-hover:text-saffron">
                {key}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* D1 This Month's Edit */}
      <section className="px-8 md:px-[64px] pb-[72px] flex flex-col gap-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[32px] md:text-[44px] text-ink">This Month's Edit</h2>
          <span className="font-sans text-[11px] tracking-label uppercase text-ink/60">JUST ARRIVED IN ERODE</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {vm.latestEdit.map((saree, idx) => (
            <SareeCard key={saree.id} saree={saree} priority={idx < 2} />
          ))}
        </div>
      </section>

      {/* D1 Curator Block */}
      <section className="bg-sand px-8 md:px-[64px] py-[72px] flex flex-col md:flex-row gap-12 md:gap-[56px] items-center">
        <div className="w-[280px] md:w-[360px] h-[360px] md:h-[440px] placeholder-weave flex-shrink-0 border border-ink/15" />

        <div className="flex flex-col gap-[22px]">
          <span className="font-sans text-[11px] tracking-label-wide uppercase text-pressed font-medium">
            {UI.curatorQuote.eyebrow}
          </span>
          <blockquote className="font-display text-[26px] md:text-[38px] leading-[1.25] text-ink max-w-[720px]">
            {UI.curatorQuote.quote}
          </blockquote>
          <div className="font-tamil text-[19px] text-ink/80">
            {UI.curatorQuote.tamilQuote}
          </div>
          <span className="font-sans text-[11px] tracking-label uppercase text-ink/60 mt-1">
            {UI.curatorQuote.attribution}
          </span>
        </div>
      </section>

      {/* D1 Worn by You (Instagram) */}
      <section className="px-8 md:px-[64px] py-[72px] flex flex-col gap-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[32px] md:text-[38px] text-ink">{UI.instagram.heading}</h2>
          <span className="font-sans text-[11px] tracking-label uppercase text-ink/60">{UI.instagram.subline}</span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="aspect-square placeholder-weave border border-ink/10" />
          ))}
        </div>
      </section>
    </div>
  );
}
