"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Saree } from "@/model/domain/types";
import { Price } from "../primitives/Price";
import { Badge } from "../primitives/Badge";
import { StitchFrame } from "../thread/StitchFrame";
import { cn } from "@/lib/utils";

interface SareeCardProps {
  saree: Saree;
  className?: string;
  priority?: boolean;
  /** Position in the grid. Frames sew 150ms apart, so a row reads left to right. */
  index?: number;
}

/**
 * One saree, one photograph.
 *
 * The card's gold frame draws itself when it arrives on screen — that is the
 * thread reaching the card, and it is the only motion here. No image swap, no
 * video, no zoom: her photo is not fighting anything. Hover lifts the card
 * 10px and warms its shadow, nothing more.
 */
export const SareeCard: React.FC<SareeCardProps> = ({
  saree,
  className,
  priority = false,
  index = 0,
}) => {
  const [imgError, setImgError] = useState(false);

  const isSoldOut = saree.status === "sold";
  const firstImg = saree.images[0]?.id;
  const hasPhoto = !!firstImg && !firstImg.includes("icon-flat") && !imgError;
  const isBase64 = firstImg?.startsWith("data:");

  return (
    <Link
      href={`/saree/${saree.slug}`}
      className={cn(
        "group flex flex-col gap-3 text-left transition-transform duration-500 ease-silk hover:-translate-y-[10px]",
        className
      )}
    >
      <div className="relative aspect-saree overflow-hidden bg-sand transition-shadow duration-500 ease-silk group-hover:shadow-[0_18px_30px_-14px_rgba(120,84,40,0.55)]">
        {hasPhoto ? (
          <Image
            src={firstImg}
            alt={saree.images[0]?.alt || saree.title.en}
            fill
            priority={priority}
            unoptimized={isBase64}
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          // Until her photograph lands, the saree's own hue stands in — woven,
          // not flat, so a card without a picture still reads as cloth.
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

        {/* The thread arrives. */}
        <StitchFrame delayMs={(index % 4) * 150} />

        {isSoldOut && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant="pressed">SOLD OUT</Badge>
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[17px] font-normal leading-tight text-ink transition-colors group-hover:text-saffron md:text-[19px]">
          {saree.title.en}
        </h3>
        <Price
          amountInPaise={saree.priceInPaise}
          className="flex-shrink-0 font-sans text-[12px] font-normal text-saffron"
        />
      </div>

      <span className="font-sans text-[9.5px] uppercase tracking-label text-ink/50">
        {saree.fabric}
      </span>
    </Link>
  );
};
