import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/infrastructure/container";
import { Button } from "@/view/primitives/Button";
import { ThreadField } from "@/view/thread/ThreadField";
import { ThreadRule } from "@/view/thread/ThreadRule";
import { UI } from "@/content/ui";

export const metadata: Metadata = {
  title: "Offers · Velora",
  description: "Current vouchers on handpicked silk sarees from Erode.",
};

export default async function OffersPage() {
  const offers = await container.offerRepository.listActive();

  return (
    <div className="flex w-full flex-col gap-12 px-4 pb-20 pt-6 md:gap-[64px] md:px-[60px]">
      <section className="thread-ground relative overflow-hidden border border-ink/12">
        <ThreadField variant="band" />
        <div className="relative z-10 flex flex-col gap-3 px-6 py-12 md:px-11 md:py-14">
          <span className="font-sans text-[10px] uppercase tracking-label-wide text-saffron">
            DIRECT FROM THE SHOP IN ERODE
          </span>
          <h1 className="font-display text-[40px] leading-none md:text-[64px]">Offers</h1>
          <p className="m-0 max-w-[560px] font-sans text-[14px] leading-[1.85] text-ink/72">
            Her prices come straight from the counter. When there is a voucher running, it is here —
            and it applies at checkout, not on a banner.
          </p>
        </div>
      </section>

      {offers.length === 0 ? (
        <p className="py-16 text-center font-sans text-[15px] text-ink/70">
          No vouchers running right now. Prices are the shop&apos;s own either way.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="flex flex-col justify-between gap-6 border border-ink/15 bg-panel p-7"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="border border-saffron/30 bg-saffron/10 px-3 py-1 font-mono text-[13px] font-medium text-saffron">
                    {offer.code}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-label text-ink/55">
                    VALID UNTIL{" "}
                    {new Date(offer.validUntil).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h2 className="mt-1 font-display text-[26px]">{offer.title.en}</h2>
                <p className="m-0 font-tamil text-[16px] text-ink/75">{offer.title.ta}</p>
                <ThreadRule soft />
                <p className="m-0 font-sans text-[14px] leading-[1.75] text-ink/80">
                  {offer.description.en}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-4">
                <span className="font-sans text-[10px] font-medium uppercase tracking-label text-pressed">
                  APPLY AT CHECKOUT
                </span>
                <Link href="/shop">
                  <Button variant="secondary" className="h-11 px-6 text-[10px]">
                    {UI.bag.emptyCta}
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
