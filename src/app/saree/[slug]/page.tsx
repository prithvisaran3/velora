import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductViewModel } from "@/viewmodel/server/product.viewmodel";
import { SareeBuy } from "@/view/components/SareeBuy";
import { SareeCard } from "@/view/components/SareeCard";
import { JsonLd } from "@/view/components/JsonLd";
import { ThreadColour } from "@/view/thread/ThreadColour";
import { ThreadRule } from "@/view/thread/ThreadRule";
import { Price } from "@/view/primitives/Price";
import { WhatsAppFab } from "@/view/layout/WhatsAppFab";
import { UI } from "@/content/ui";

interface PDPPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PDPPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vm = await getProductViewModel(slug);
  if (!vm) return { title: "Saree not found · Velora" };
  return {
    title: `${vm.saree.title.en} · Velora`,
    description: `${vm.saree.fabric} in ${vm.saree.colour.label.en}. Handpicked in Erode by Priya Mahadevan.`,
  };
}

const SPEC_LABELS = ["FABRIC", "LENGTH", "BLOUSE PIECE", "ZARI", "CARE", "WEIGHT"] as const;

/**
 * The product page keeps the layout that worked: photograph left, everything
 * you need to decide on the right, specs and authenticity beneath the buttons.
 *
 * The thread takes this saree's colour on the way in and gives it back on the
 * way out. The photograph itself is never colour-shifted.
 */
export default async function PDPPage({ params }: PDPPageProps) {
  const { slug } = await params;
  const vm = await getProductViewModel(slug);
  if (!vm) notFound();

  const { saree, relatedSarees } = vm;

  const specs: Record<(typeof SPEC_LABELS)[number], string> = {
    FABRIC: saree.fabric,
    LENGTH: `${(saree.lengthCm / 100).toFixed(1)} m incl. blouse`,
    "BLOUSE PIECE": `${(saree.blousePieceCm / 100).toFixed(1)} m, attached`,
    ZARI: saree.zari,
    CARE: saree.care,
    WEIGHT: `${saree.weightGrams} g`,
  };

  return (
    <div className="measure flex w-full flex-col gap-14 pb-24 pt-6 md:gap-[64px]">
      <ThreadColour colour={saree.colour.key} />
      <JsonLd saree={saree} />

      <SareeBuy
        saree={saree}
        header={
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] uppercase tracking-label-wide text-saffron">
              {UI.pdp.handpicked}
            </span>
            <h1 className="font-display text-[34px] leading-[1.04] md:text-[52px]">
              {saree.title.en}
            </h1>
            <p className="m-0 font-tamil text-[17px] text-ink/75">{saree.title.ta}</p>

            <ThreadRule />

            <div className="flex items-baseline gap-4">
              <Price
                amountInPaise={saree.priceInPaise}
                className="font-display text-[30px] md:text-[38px]"
              />
              <span className="font-sans text-[10px] uppercase tracking-label text-ink/60">
                {UI.pdp.inclGst}
              </span>
            </div>

            {saree.status === "available" && (
              <span className="font-sans text-[10px] font-medium uppercase tracking-label text-pressed">
                {UI.pdp.onlyOne}
              </span>
            )}
          </div>
        }
        details={
          <div className="flex flex-col gap-7">
            <dl className="m-0 flex flex-col border-y border-ink/15 font-sans text-[12px]">
              {SPEC_LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`flex justify-between gap-6 py-3 ${
                    index < SPEC_LABELS.length - 1 ? "border-b border-ink/10" : ""
                  }`}
                >
                  <dt className="uppercase tracking-[0.16em] text-ink/55">{label}</dt>
                  <dd className="m-0 text-right text-ink">{specs[label]}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-2 bg-panel p-5">
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.26em] text-saffron">
                {UI.pdp.authenticityEyebrow}
              </span>
              <p className="m-0 font-sans text-[12px] leading-[1.75] text-ink/80">
                {saree.authenticityNote}
              </p>
              <p className="m-0 font-sans text-[11px] leading-[1.75] text-ink/65">
                {UI.trust.returns} · {UI.trust.cod} · {UI.trust.gst}
              </p>
            </div>

            {saree.curatorNote && (
              <blockquote className="m-0 border-l border-[var(--thread)] pl-4 font-display text-[18px] leading-[1.5] text-ink/85">
                {saree.curatorNote}
              </blockquote>
            )}
          </div>
        }
      />

      {relatedSarees.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="font-display text-[28px] md:text-[34px]">{UI.pdp.relatedHeading}</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-[26px]">
            {relatedSarees.map((related, index) => (
              <SareeCard key={related.id} saree={related} index={index} />
            ))}
          </div>
        </section>
      )}

      <WhatsAppFab hasStickyBar />
    </div>
  );
}
