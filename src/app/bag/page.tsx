"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/viewmodel/client/useCart";
import { Money } from "@/model/domain/money";
import { Price } from "@/view/primitives/Price";
import { Button } from "@/view/primitives/Button";
import { ThreadRule } from "@/view/thread/ThreadRule";
import { ThreadStepper } from "@/view/thread/ThreadStepper";
import { ThreadLoaderPage } from "@/view/thread/ThreadLoader";
import { UI } from "@/content/ui";

export default function BagPage() {
  const { cartItems, cartCount, totalPaise, removeFromCart, isLoaded } = useCart();

  if (!isLoaded) return <ThreadLoaderPage />;

  const total = Money.fromPaise(totalPaise);

  return (
    <div className="mx-auto flex w-full max-w-[840px] flex-col gap-8 px-4 py-12 md:px-8">
      <ThreadStepper steps={UI.checkout.steps} current={0} />

      <h1 className="font-display text-[34px] md:text-[44px]">{UI.bag.heading}</h1>

      {cartCount === 0 ? (
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <p className="m-0 font-display text-[20px] text-ink/60">{UI.bag.empty}</p>
          <Link href="/shop">
            <Button variant="primary">{UI.bag.emptyCta}</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <ul className="m-0 flex list-none flex-col gap-6 p-0">
            {cartItems.map((item) => {
              const photo = item.images[0]?.id;
              const hasPhoto = !!photo && !photo.includes("icon-flat");
              return (
                <li key={item.id} className="flex flex-col gap-6">
                  <ThreadRule soft />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="relative h-[106px] w-[80px] flex-shrink-0 overflow-hidden border border-ink/10 bg-sand">
                        {hasPhoto ? (
                          <Image
                            src={photo}
                            alt={item.title.en}
                            fill
                            unoptimized={photo.startsWith("data:")}
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(168deg, ${item.colour.hex}, var(--color-ink))`,
                            }}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-sans text-[9px] font-medium uppercase tracking-label text-pressed">
                          {UI.pdp.onlyOne}
                        </span>
                        <h2 className="font-display text-[17px] md:text-[19px]">{item.title.en}</h2>
                        <span className="font-sans text-[12px] text-ink/70">
                          {item.fabric} · {item.colour.label.en}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="mt-2 text-left font-sans text-[11px] text-pressed underline hover:opacity-80"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <Price
                      amountInPaise={item.priceInPaise}
                      className="flex-shrink-0 font-sans text-[16px]"
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-4 border-t border-ink/20 pt-6">
            <div className="flex items-center justify-between font-sans text-[14px]">
              <span className="text-ink/75">Subtotal</span>
              <Price amountInPaise={total} className="font-sans text-[15px]" />
            </div>
            <div className="flex items-center justify-between font-sans text-[14px]">
              <span className="text-ink/75">{UI.trust.shipping}</span>
              <span className="font-sans text-[12px] uppercase tracking-label text-saffron">
                {UI.checkout.shippingLabel}
              </span>
            </div>

            <ThreadRule />

            <div className="flex items-center justify-between font-display text-[22px]">
              <span>Total</span>
              <Price amountInPaise={total} className="font-display text-[24px]" />
            </div>
            <p className="m-0 font-sans text-[11px] text-ink/60">{UI.checkout.gstNote}</p>

            <Link href="/checkout" className="mt-2">
              <Button variant="primary" fullWidth glint>
                {UI.bag.checkout}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
