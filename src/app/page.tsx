import React from "react";
import Link from "next/link";
import { getHomeViewModel } from "@/viewmodel/server/home.viewmodel";
import { Button } from "@/view/primitives/Button";
import { SareeCard } from "@/view/components/SareeCard";
import { configFixture } from "@/model/fixtures/config.fixture";
import { OccasionKey, ColourKey } from "@/model/domain/types";

export default async function HomePage() {
  const vm = await getHomeViewModel();

  const occasions = Object.entries(configFixture.occasions) as [
    OccasionKey,
    { title: { en: string; ta: string }; description: { en: string; ta: string } }
  ][];

  const colours = Object.entries(configFixture.colours) as [
    ColourKey,
    { hex: string; label: { en: string; ta: string } }
  ][];

  return (
    <div className="flex flex-col w-full bg-[#FDF4E4]">
      {/* D1 Hero Section */}
      <section className="relative w-full h-[660px] placeholder-weave flex items-end p-8 md:p-[64px] overflow-hidden border-b border-[#241F1C]/15">
        <div className="relative z-10 max-w-[840px] flex flex-col gap-[26px]">
          <h1 className="font-display text-[52px] md:text-[104px] text-[#241F1C] leading-[0.94] text-balance">
            Handpicked, never<br />warehoused.
          </h1>
          <p className="font-sans text-[15px] md:text-[16px] text-[#241F1C]/80 max-w-[520px] leading-[1.7]">
            Forty-eight modern sarees chosen this month by our curator in Erode. Every one seen and felt before it is listed.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/saree/deep-maroon-mangai-zari-silk">
              <Button variant="primary">SEE THIS MONTH'S EDIT</Button>
            </Link>
            <Link href="/colour/maroon">
              <Button variant="secondary">SHOP BY COLOUR</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* D1 Legacy Strip */}
      <section className="bg-[#241F1C] text-[#FDF4E4] px-8 md:px-[64px] py-[44px] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="font-display text-[32px] md:text-[38px] text-[#FDF4E4] leading-[1.1]">
          Chosen in Erode,<br />since 1977.
        </div>
        <div className="flex items-center gap-10 md:gap-14">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-display text-[34px] text-[#F5A623]">49</span>
            <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#FDF4E4]/65">YEARS IN SILK</span>
          </div>
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-display text-[34px] text-[#F5A623]">3</span>
            <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#FDF4E4]/65">GENERATIONS</span>
          </div>
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-display text-[34px] text-[#F5A623]">48</span>
            <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#FDF4E4]/65">SAREES A MONTH</span>
          </div>
        </div>
      </section>

      {/* D1 Shop by Occasion */}
      <section className="px-8 md:px-[64px] py-[72px] flex flex-col gap-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[32px] md:text-[44px] text-[#241F1C]">Shop by occasion</h2>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#241F1C]/60">MOMENTS, NOT CATEGORIES</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {occasions.map(([key, data]) => (
            <Link key={key} href={`/occasion/${key}`} className="flex flex-col gap-2.5 group">
              <div className="aspect-[3/4] placeholder-weave p-3 flex items-end border border-[#241F1C]/10 group-hover:border-[#E8621B] transition-colors">
                <span className="font-mono text-[9px] text-[#241F1C]/55">{key}</span>
              </div>
              <span className="font-display text-[18px] text-[#241F1C] group-hover:text-[#E8621B] transition-colors">
                {data.title.en}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#F5A623] to-transparent mx-[64px]" />

      {/* D1 Shop by Colour */}
      <section className="px-8 md:px-[64px] py-[72px] flex flex-col md:flex-row gap-12 md:gap-[64px] items-center">
        <div className="flex flex-col gap-5 max-w-[400px]">
          <h2 className="font-display text-[36px] md:text-[44px] leading-[1.05] text-[#241F1C]">Shop by colour</h2>
          <p className="font-sans text-[14px] leading-[1.75] text-[#241F1C]/78">
            How sarees are actually chosen. Pick a colour and browse the full collection in that hue — from deep maroon bridal silks to everyday kora cottons.
          </p>
        </div>

        <div className="flex flex-wrap gap-5 flex-1 justify-center md:justify-start">
          {colours.map(([key, data]) => (
            <Link key={key} href={`/colour/${key}`} className="flex flex-col items-center gap-2.5 group">
              <div
                className="w-[88px] h-[88px] md:w-[96px] md:h-[96px] rounded-full border border-black/10 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: data.hex }}
              />
              <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#241F1C]/70 group-hover:text-[#E8621B]">
                {key}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* D1 This Month's Edit */}
      <section className="px-8 md:px-[64px] pb-[72px] flex flex-col gap-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[32px] md:text-[44px] text-[#241F1C]">This month's edit</h2>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#241F1C]/60">48 SAREES · JULY EDIT</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {vm.latestEdit.map((saree, idx) => (
            <SareeCard key={saree.id} saree={saree} priority={idx < 2} />
          ))}
        </div>
      </section>

      {/* D1 Curator Block */}
      <section className="bg-[#F6EAD6] px-8 md:px-[64px] py-[72px] flex flex-col md:flex-row gap-12 md:gap-[56px] items-center">
        <div className="w-[280px] md:w-[360px] h-[360px] md:h-[440px] placeholder-weave flex-shrink-0 border border-[#241F1C]/15" />

        <div className="flex flex-col gap-[22px]">
          <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#B4470F] font-medium">
            FROM THE CURATOR
          </span>
          <blockquote className="font-display text-[26px] md:text-[38px] leading-[1.25] text-[#241F1C] max-w-[720px]">
            "My father could tell you which loom a saree came off with his eyes shut. He sent me to the weavers alone at nineteen. I still hold every one to the light before it goes on this website."
          </blockquote>
          <div className="font-tamil text-[19px] text-[#241F1C]/80">
            ஒவ்வொரு புடவையும் என் கையால் தேர்ந்தெடுக்கப்பட்டது.
          </div>
          <span className="font-sans text-[11px] tracking-[0.22em] uppercase text-[#241F1C]/60 mt-1">
            — PRIYA MAHADEVAN · FOUNDER &amp; CURATOR, ERODE
          </span>
        </div>
      </section>

      {/* D1 Worn by You (Instagram) */}
      <section className="px-8 md:px-[64px] py-[72px] flex flex-col gap-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[32px] md:text-[38px] text-[#241F1C]">Worn by you</h2>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#241F1C]/60">@VELORA · REAL CUSTOMER PHOTOS</span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="aspect-square placeholder-weave border border-[#241F1C]/10" />
          ))}
        </div>
      </section>
    </div>
  );
}
