import React from "react";
import { Paise } from "@/model/domain/types";
import { Money } from "@/model/domain/money";
import { cn } from "@/lib/utils";

interface PriceProps {
  amountInPaise: Paise;
  className?: string;
}

export const Price: React.FC<PriceProps> = ({ amountInPaise, className }) => {
  return (
    <span className={cn("font-display tracking-tight text-ink", className)}>
      {Money.formatRupees(amountInPaise)}
    </span>
  );
};
