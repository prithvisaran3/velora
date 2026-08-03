"use client";

import React from "react";
import { Button } from "../primitives/Button";
import { Price } from "../primitives/Price";
import { Paise } from "@/model/domain/types";

interface StickyBuyBarProps {
  priceInPaise: Paise;
  onAddToBag: () => void;
  isSoldOut?: boolean;
}

export const StickyBuyBar: React.FC<StickyBuyBarProps> = ({
  priceInPaise,
  onAddToBag,
  isSoldOut = false,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDF4E4] border-t border-[#241F1C]/15 p-3 px-4 flex items-center justify-between shadow-md">
      <div className="flex flex-col">
        <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#241F1C]/55">
          INCL. GST · FREE SHIPPING
        </span>
        <Price amountInPaise={priceInPaise} className="text-[22px] font-display" />
      </div>

      <Button
        variant={isSoldOut ? "disabled" : "primary"}
        onClick={onAddToBag}
        disabled={isSoldOut}
        className="h-[48px] px-6 text-[11px]"
      >
        {isSoldOut ? "SOLD" : "ADD TO BAG"}
      </Button>
    </div>
  );
};
