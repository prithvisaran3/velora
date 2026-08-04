"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../primitives/Button";
import { Price } from "../primitives/Price";
import { MoneyPaise } from "@/model/domain/types";
import { UI } from "@/content/ui";

interface StickyBuyBarProps {
  priceInPaise: MoneyPaise;
  onAddToBag: () => void;
  isSoldOut?: boolean;
}

export const StickyBuyBar: React.FC<StickyBuyBarProps> = ({
  priceInPaise,
  onAddToBag,
  isSoldOut = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-ink text-cream p-4 border-t border-marigold/40 shadow-none transition-transform duration-300 transform translate-y-0">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4">
        <div className="flex flex-col">
          <span className="font-sans text-[10px] tracking-label uppercase text-marigold">
            HANDPICKED SAREE
          </span>
          <Price amountInPaise={priceInPaise} className="text-[18px] text-cream" />
        </div>

        <Button
          variant={isSoldOut ? "disabled" : "primary"}
          onClick={onAddToBag}
          disabled={isSoldOut}
          className="py-3 px-6 text-[11px] tracking-label"
        >
          {isSoldOut ? "SOLD OUT" : UI.pdp.addToBag}
        </Button>
      </div>
    </div>
  );
};
