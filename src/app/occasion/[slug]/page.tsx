import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getOccasionCollectionVM } from "@/viewmodel/server/collection.viewmodel";
import { OccasionKey } from "@/model/domain/types";
import { SareeGrid } from "@/view/components/SareeGrid";
import { ThreadField } from "@/view/thread/ThreadField";
import { ThreadRule } from "@/view/thread/ThreadRule";
import { configFixture } from "@/model/fixtures/config.fixture";
import { UI } from "@/content/ui";
import { cn } from "@/lib/utils";

interface OccasionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: OccasionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vm = await getOccasionCollectionVM((slug || "muhurtham") as OccasionKey);
  return {
    title: `${vm.occasionData.title.en} sarees · Velora`,
    description: vm.occasionData.description.en,
  };
}

/**
 * Moments, not categories. The morning of a wedding needs a different saree
 * from a Friday at the temple, and she chooses for each one separately.
 *
 * No occasion advertises how many sarees are in it.
 */
export default async function OccasionPage({ params }: OccasionPageProps) {
  const { slug } = await params;
  const occasionKey = (slug || "muhurtham") as OccasionKey;
  const vm = await getOccasionCollectionVM(occasionKey);

  const occasions = Object.entries(configFixture.occasions) as [
    OccasionKey,
    { title: { en: string; ta: string }; description: { en: string; ta: string } }
  ][];

  return (
    <div className="flex w-full flex-col gap-12 px-4 pb-20 pt-6 md:gap-[64px] md:px-[60px]">
      <section className="thread-ground relative overflow-hidden border border-ink/12">
        <ThreadField variant="band" />
        <div className="relative z-10 flex flex-col gap-3 px-6 py-12 md:px-11 md:py-14">
          <span className="font-sans text-[10px] uppercase tracking-label-wide text-saffron">
            {UI.occasions.subline}
          </span>
          <h1 className="font-display text-[40px] leading-none md:text-[64px]">
            {vm.occasionData.title.en}
          </h1>
          <p className="m-0 max-w-[560px] font-sans text-[14px] leading-[1.85] text-ink/72">
            {vm.occasionData.description.en}
          </p>
        </div>
      </section>

      {/* Every other moment, so a shopper can cross over without going back. */}
      <nav className="no-scrollbar flex gap-2.5 overflow-x-auto">
        {occasions.map(([key, data]) => (
          <Link
            key={key}
            href={`/occasion/${key}`}
            className={cn(
              "flex-shrink-0 border px-4 py-2.5 font-sans text-[10px] uppercase tracking-label transition-colors duration-hover",
              key === occasionKey
                ? "border-saffron text-saffron"
                : "border-ink/20 text-ink/60 hover:border-ink/40"
            )}
            aria-current={key === occasionKey ? "page" : undefined}
          >
            {data.title.en}
          </Link>
        ))}
      </nav>

      <ThreadRule soft />

      {vm.sarees.length > 0 ? (
        <SareeGrid sarees={vm.sarees} />
      ) : (
        <p className="py-16 text-center font-sans text-[15px] text-ink/70">
          {UI.emptyStates.occasion(vm.occasionData.title.en.toLowerCase())}
        </p>
      )}
    </div>
  );
}
