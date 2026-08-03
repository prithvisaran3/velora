import React from "react";
import { MoneyPaise } from "@/model/domain/types";
import { Money } from "@/model/domain/money";
import { cn } from "@/lib/utils";

interface PriceProps {
  amountInPaise: MoneyPaise;
  className?: string;
}

export const Price: React.FC<PriceProps> = ({ amountInPaise, className }) => {
  const formattedPrice = Money.formatRupees(amountInPaise);

  return (
    <span className={cn("font-display font-medium text-ink", className)}>
      {formattedPrice}
    </span>
  );
};
