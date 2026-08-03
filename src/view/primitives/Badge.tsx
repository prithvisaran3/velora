import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cream" | "pressed" | "sand";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "cream", className }) => {
  const variantStyles = {
    cream: "bg-[#FDF4E4] text-[#241F1C]",
    pressed: "bg-[#B4470F] text-[#FDF4E4]",
    sand: "bg-[#F6EAD6] text-[#241F1C]",
  };

  return (
    <span
      className={cn(
        "inline-block px-2 py-1 font-sans text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-medium leading-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
