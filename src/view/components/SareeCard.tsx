"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Saree } from "@/model/domain/types";
import { Price } from "../primitives/Price";
import { Badge } from "../primitives/Badge";
import { cn } from "@/lib/utils";

interface SareeCardProps {
  saree: Saree;
  className?: string;
  priority?: boolean;
}

export const SareeCard: React.FC<SareeCardProps> = ({ saree, className, priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isSoldOut = saree.status === "sold";
  const isOnlyOneInStock = saree.status === "available";

  const firstImg = saree.images[0]?.id;
  const isRealFirstImg = !!firstImg && !firstImg.includes("icon-flat") && !imgError;

  const secondImg = saree.images[1]?.id;
  const isRealSecondImg = !!secondImg && !secondImg.includes("icon-flat");

  // IntersectionObserver for mobile scroll-into-view cross-fade
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const showDraped = (isHovered || isInView) && isRealSecondImg;
  const isBase64 = firstImg?.startsWith("data:");

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("flex flex-col gap-3 group text-left", className)}
    >
      <Link
        href={`/saree/${saree.slug}`}
        className="block relative aspect-saree overflow-hidden border border-ink/10 bg-sand"
      >
        {/* Real Image or Woven Silk Backdrop Fallback */}
        {isRealFirstImg ? (
          <Image
            src={firstImg}
            alt={saree.images[0]?.alt || saree.title.en}
            fill
            priority={priority}
            unoptimized={isBase64}
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-cover transition-opacity duration-crossfade ease-silk",
              showDraped ? "opacity-0" : "opacity-100"
            )}
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col justify-between p-4"
            style={{
              background: `linear-gradient(135deg, ${saree.colour.hex || "var(--color-saree-maroon)"} 0%, var(--color-ink) 100%)`,
            }}
          >
            <div className="flex justify-between items-start">
              <span className="font-display text-[14px] text-cream tracking-label uppercase opacity-90">
                VELORA
              </span>
              <div className="w-6 h-6 border border-marigold rounded-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-marigold" />
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-marigold/40 pt-3">
              <span className="font-display text-[16px] text-cream leading-tight">
                {saree.title.en}
              </span>
              <span className="font-sans text-[9px] tracking-label uppercase text-marigold">
                {saree.colour.label.en} · PATTU SAREE
              </span>
            </div>
          </div>
        )}

        {/* Draped cross-fade image */}
        {isRealSecondImg && !imgError && (
          <Image
            src={secondImg}
            alt={saree.images[1]?.alt || `${saree.title.en} draped`}
            fill
            unoptimized={secondImg.startsWith("data:")}
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-cover transition-opacity duration-crossfade ease-silk absolute inset-0",
              showDraped ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {saree.drapeVideo && <Badge variant="cream">3S DRAPE LOOP</Badge>}
          {isSoldOut && <Badge variant="pressed">SOLD OUT</Badge>}
        </div>
      </Link>

      <div className="flex flex-col gap-1">
        <Link href={`/saree/${saree.slug}`} className="group-hover:text-saffron transition-colors">
          <h3 className="font-display text-[19px] text-ink font-normal line-clamp-1">
            {saree.title.en}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-[11px] font-sans text-ink/70">
          <span>{saree.fabric}</span>
          <Price amountInPaise={saree.priceInPaise} className="font-sans text-[11px] text-ink/80" />
        </div>

        {isOnlyOneInStock && !isSoldOut && (
          <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-pressed font-medium mt-0.5">
            ONLY ONE IN STOCK
          </span>
        )}
      </div>
    </div>
  );
};
