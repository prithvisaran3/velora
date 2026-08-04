import React from "react";
import { cn } from "@/lib/utils";

interface LabelProps {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ children, wide = false, className }) => {
  return (
    <span
      className={cn(
        "font-sans uppercase text-[10px] md:text-[11px] text-ink/55 font-normal",
        wide ? "tracking-[0.3em]" : "tracking-[0.2em]",
        className
      )}
    >
      {children}
    </span>
  );
};
