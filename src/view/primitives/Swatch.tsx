"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ColourKey } from "@/model/domain/types";

interface SwatchProps {
  colourKey: ColourKey;
  hex: string;
  label: string;
  isSelected?: boolean;
  isSoldOut?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Swatch: React.FC<SwatchProps> = ({
  colourKey,
  hex,
  label,
  isSelected = false,
  isSoldOut = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSoldOut}
      aria-label={`${label}${isSoldOut ? " (Sold out)" : ""}`}
      className={cn(
        "relative rounded-full transition-all duration-hover cursor-pointer flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center",
        isSelected ? "w-[78px] h-[78px]" : "w-[72px] h-[72px] hover:w-[78px] hover:h-[78px]",
        isSoldOut && "opacity-[0.28] cursor-not-allowed",
        className
      )}
      style={{
        backgroundColor: hex,
        boxShadow: isSelected ? `0 0 0 3px var(--color-cream), 0 0 0 5px ${hex}` : undefined,
      }}
    >
      {isSoldOut && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[1px] bg-ink/40 rotate-45" />
        </div>
      )}
    </button>
  );
};
