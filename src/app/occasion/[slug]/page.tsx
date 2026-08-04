import React from "react";
import Link from "next/link";
import { getOccasionCollectionVM } from "@/viewmodel/server/collection.viewmodel";
import { OccasionKey } from "@/model/domain/types";
import { Button } from "@/view/primitives/Button";
import { SareeCard } from "@/view/components/SareeCard";
import { configFixture } from "@/model/fixtures/config.fixture";
import { UI } from "@/content/ui";

interface OccasionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function OccasionPage({ params }: OccasionPageProps) {
  const resolvedParams = await params;
  const occasionKey = (resolvedParams.slug || "muhurtham") as OccasionKey;
  const vm = await getOccasionCollectionVM(occasionKey);

  const occasions = Object.entries(configFixture.occasions) as [
    OccasionKey,
    { title: { en: string; ta: string }; description: { en: string; ta: string } }
  ][];

  return (
    <div className="w-full bg-cream min-h-screen flex flex-col">
      {/* D3 Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-14 flex flex-col gap-4">
        <h1 className="font-display text-[52px] md:text-[76px] leading-[0.98] text-ink">
          Six moments
        </h1>
        <p className="font-sans text-[15px] leading-[1.75] text-ink/78 max-w-[560px]">
          Not categories. The morning of a wedding needs a different saree from a Friday at the temple, and we choose for each one separately.
        </p>
      </div>

      {/* D3 Editorial Row 1: Muhurtham */}
      <div className="w-full border-t border-ink/12 flex flex-col md:flex-row items-stretch">
        <div className="w-full md:w-[520px] h-[320px] md:h-[420px] placeholder-weave border-b md:border-b-0 md:border-r border-ink/12 flex-shrink-0">
        </div>
        <div className="flex-1 p-8 md:p-[56px] flex flex-col justify-center gap-4">
          <span className="font-sans text-[11px] tracking-label-wide uppercase text-pressed">
            01 · MUHURTHAM
          </span>
          <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] text-ink">
            The morning she is given away
          </h2>
          <p className="font-sans text-[14px] leading-[1.75] text-ink/78 max-w-[520px]">
            Heavy zari, deep grounds, borders that hold their shape through eight hours of ceremony. 11 sarees.
          </p>
          <div className="mt-2">
            <Link href="/occasion/muhurtham">
              <Button variant="primary" className="py-4 px-7 text-[11px]">SEE MUHURTHAM</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* D3 Editorial Row 2: Temple */}
      <div className="w-full border-t border-ink/12 flex flex-col md:flex-row-reverse items-stretch">
        <div className="w-full md:w-[520px] h-[320px] md:h-[420px] placeholder-weave border-b md:border-b-0 md:border-l border-ink/12 flex-shrink-0">
        </div>
        <div className="flex-1 p-8 md:p-[56px] flex flex-col justify-center gap-4">
          <span className="font-sans text-[11px] tracking-label-wide uppercase text-pressed">
            03 · TEMPLE
          </span>
          <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] text-ink">
            Friday morning, bare feet
          </h2>
          <p className="font-sans text-[14px] leading-[1.75] text-ink/78 max-w-[520px]">
            Kora cottons and light silks in turmeric, kumkum and undyed cream. Easy to wash, easy to wear again next week. 8 sarees.
          </p>
          <div className="mt-2">
            <Link href="/occasion/temple">
              <Button variant="primary" className="py-4 px-7 text-[11px]">SEE TEMPLE</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filtered Sarees Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-12 w-full border-t border-ink/12">
        <h3 className="font-display text-[32px] text-ink mb-6">
          {vm.occasionData.title.en} Collection
        </h3>

        {vm.sarees.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {vm.sarees.map((saree) => (
              <SareeCard key={saree.id} saree={saree} />
            ))}
          </div>
        ) : (
          <div className="py-12 font-display text-[18px] opacity-60">
            No sarees currently listed for {vm.occasionData.title.en}.
          </div>
        )}
      </div>
    </div>
  );
}
