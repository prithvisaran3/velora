import React from "react";
import { cn } from "@/lib/utils";

interface TamilTextProps {
  children: React.ReactNode;
  className?: string;
}

export const TamilText: React.FC<TamilTextProps> = ({ children, className }) => {
  return (
    <span className={cn("font-tamil text-ink/80 font-normal leading-relaxed", className)}>
      {children}
    </span>
  );
};
