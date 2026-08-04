"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/viewmodel/client/useCart";
import { Price } from "@/view/primitives/Price";
import { Button } from "@/view/primitives/Button";
import { SectionHead } from "@/view/primitives/SectionHead";
import { UI } from "@/content/ui";

export default function BagPage() {
  const { cartItems, cartCount, totalPaise, removeFromCart, isLoaded } = useCart();

  if (!isLoaded) {
    return <div className="min-h-screen py-24 text-center">Loading bag...</div>;
  }

  return (
    <div className="max-w-[840px] mx-auto px-6 md:px-16 py-12 w-full min-h-screen flex flex-col">
      <SectionHead subtitle="Handpicked single-unit sarees reserved in your bag.">
        Your Shopping Bag
      </SectionHead>

      {cartCount === 0 ? (
        <div className="py-16 text-center flex flex-col items-center gap-6">
          <p className="font-display text-[20px] opacity-60">Your bag is currently empty.</p>
          <Link href="/colour/maroon">
            <Button variant="primary">Explore Saree Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-8">
          <div className="flex flex-col gap-6 divide-y divide-ink/15">
            {cartItems.map((item) => (
              <div key={item.id} className="pt-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-[80px] h-[106px] placeholder-weave border border-ink/10 overflow-hidden flex-shrink-0">
                    <Image src={item.images[0]?.id || "/brand/png/icon-flat-512.png"} alt={item.title.en} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[9px] uppercase tracking-label text-pressed font-medium">
                      HANDPICKED · ONLY ONE IN STOCK
                    </span>
                    <h3 className="font-display text-[16px] md:text-[18px] text-ink">{item.title.en}</h3>
                    <span className="font-sans text-[12px] opacity-70">{item.fabric} · {item.colour.label.en}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="font-sans text-[11px] text-pressed underline text-left mt-2 hover:opacity-80"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <Price amountInPaise={item.priceInPaise} className="text-[18px] font-sans font-medium" />
              </div>
            ))}
          </div>

          <div className="border-t border-ink/20 pt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between font-sans text-[14px]">
              <span className="opacity-75">Subtotal</span>
              <Price amountInPaise={totalPaise as any} className="font-medium text-[16px]" />
            </div>
            <div className="flex items-center justify-between font-sans text-[14px]">
              <span className="opacity-75">Insured Shipping across India</span>
              <span className="text-saffron font-medium uppercase text-[12px] tracking-wider">FREE</span>
            </div>
            <div className="flex items-center justify-between font-display text-[22px] text-ink pt-2 border-t border-ink/15">
              <span>Total Amount</span>
              <Price amountInPaise={totalPaise as any} className="text-[24px]" />
            </div>

            <Link href="/checkout">
              <Button variant="primary" fullWidth className="mt-4">
                PROCEED TO CHECKOUT
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
