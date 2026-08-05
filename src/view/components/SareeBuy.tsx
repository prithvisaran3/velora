"use client";

/**
 * The product block — everything on the page that needs the bag.
 *
 * The gallery and the buy buttons share one ref, because the flight is
 * measured from the photograph the customer is actually looking at. The bag is
 * updated first: the flight is decoration on top of a done deal, and if the
 * canvas never came up, the add still happened.
 *
 * Static detail (specs, authenticity, the price) is passed in as `details` and
 * rendered by the server — nothing here needs to know what a saree weighs.
 */

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Saree } from "@/model/domain/types";
import { useCart } from "@/viewmodel/client/useCart";
import { useBagFlight } from "@/viewmodel/client/useBagFlight";
import { Loupe } from "./Loupe";
import { Button } from "../primitives/Button";
import { StickyBuyBar } from "../layout/StickyBuyBar";
import { StitchFrame } from "../thread/StitchFrame";
import { UI } from "@/content/ui";
import { cn } from "@/lib/utils";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

interface SareeBuyProps {
  saree: Saree;
  /** Rendered above the buttons in the right column. */
  header: React.ReactNode;
  /** Rendered below the buttons in the right column. */
  details: React.ReactNode;
}

export const SareeBuy: React.FC<SareeBuyProps> = ({ saree, header, details }) => {
  const [selected, setSelected] = useState(0);
  const { addToCart, cartItems } = useCart();
  const flyToBag = useBagFlight();
  const media = useRef<HTMLDivElement>(null);

  const isSoldOut = saree.status === "sold";
  const inBag = cartItems.some((item) => item.id === saree.id);

  const handleAddToBag = useCallback(() => {
    addToCart(saree);
    flyToBag(media.current, saree.colour.hex);
  }, [addToCart, flyToBag, saree]);

  const images = saree.images.filter((img) => img.id && !img.id.includes("icon-flat"));
  const active = images[selected] ?? images[0];

  return (
    <>
      <div className="flex flex-col gap-10 md:flex-row md:gap-12">
        {/* The photograph. Still, always — it is the product. */}
        <div className="flex w-full flex-col gap-2 md:w-[54%]">
          <div ref={media} className="relative aspect-saree w-full overflow-hidden bg-sand">
            {active ? (
              <Loupe src={active.id} alt={active.alt || saree.title.en} className="h-full w-full" />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(168deg, ${saree.colour.hex}, var(--color-ink))`,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "repeating-linear-gradient(110deg, rgba(245,166,35,0.12) 0 2px, transparent 2px 15px)",
                  }}
                />
              </div>
            )}
            <StitchFrame />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-label={`View ${index + 1}`}
                  aria-current={index === selected}
                  className={cn(
                    "relative aspect-square overflow-hidden border bg-sand transition-colors duration-hover",
                    index === selected
                      ? "border-saffron"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img.id}
                    alt={img.alt || `${saree.title.en} view ${index + 1}`}
                    fill
                    unoptimized={img.id.startsWith("data:")}
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-7">
          {header}

          <div className="flex flex-col gap-3">
            <Button
              variant={isSoldOut ? "disabled" : "primary"}
              onClick={handleAddToBag}
              disabled={isSoldOut}
              fullWidth
              glint={!isSoldOut && !inBag}
            >
              {isSoldOut ? UI.pdp.soldOut : inBag ? UI.pdp.inBag : UI.pdp.addToBag}
            </Button>

            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                `I'm interested in ${saree.title.en} (${saree.slug})`
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="whatsapp" fullWidth>
                {UI.pdp.askWhatsapp}
              </Button>
            </a>
          </div>

          {details}
        </div>
      </div>

      <StickyBuyBar
        priceInPaise={saree.priceInPaise}
        onAddToBag={handleAddToBag}
        isSoldOut={isSoldOut}
      />
    </>
  );
};
