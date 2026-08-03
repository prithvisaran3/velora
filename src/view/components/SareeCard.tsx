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
  const cardRef = useRef<HTMLDivElement>(null);

  const isSoldOut = saree.status === "sold";
  const isOnlyOneInStock = saree.status === "available";

  const firstImg = saree.images[0]?.id;
  const isRealFirstImg = firstImg && !firstImg.includes("icon-flat");

  const secondImg = saree.images[1]?.id;
  const isRealSecondImg = secondImg && !secondImg.includes("icon-flat");

  // IntersectionObserver for mobile scroll-into-view cross-fade
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const showDraped = (isHovered || isInView) && isRealSecondImg;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("flex flex-col gap-3 group text-left", className)}
    >
      <Link
        href={`/saree/${saree.slug}`}
        className="block relative aspect-[3/4] overflow-hidden placeholder-weave border border-[#241F1C]/10"
      >
        {/* Real Image or Woven Placeholder */}
        {isRealFirstImg ? (
          <Image
            src={firstImg}
            alt={saree.images[0]?.alt || saree.title.en}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-cover transition-opacity duration-600 ease-silk",
              showDraped ? "opacity-0" : "opacity-100"
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-3">
            <span className="font-mono text-[9px] text-[#241F1C]/55">
              {saree.colour.label.en} saree · 3/4 drape
            </span>
          </div>
        )}

        {/* Draped cross-fade image */}
        {isRealSecondImg && (
          <Image
            src={secondImg}
            alt={saree.images[1]?.alt || `${saree.title.en} draped`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-cover transition-opacity duration-600 ease-silk absolute inset-0",
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
        <Link href={`/saree/${saree.slug}`} className="group-hover:text-[#E8621B] transition-colors">
          <h3 className="font-display text-[19px] text-ink font-normal line-clamp-1">
            {saree.title.en}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-[11px] font-sans text-[#241F1C]/70">
          <span>{saree.fabric}</span>
          <Price amountInPaise={saree.priceInPaise} className="font-sans text-[11px] text-[#241F1C]/80" />
        </div>

        {isOnlyOneInStock && !isSoldOut && (
          <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#B4470F] font-medium mt-0.5">
            ONLY ONE IN STOCK
          </span>
        )}
      </div>
    </div>
  );
};
