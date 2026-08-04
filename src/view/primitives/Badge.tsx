import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cream" | "pressed" | "sand";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "cream", className }) => {
  const variantStyles = {
    cream: "bg-cream text-ink",
    pressed: "bg-pressed text-cream",
    sand: "bg-sand text-ink",
  };

  return (
    <span
      className={cn(
        "inline-block px-2 py-1 font-sans text-[8px] md:text-[9px] uppercase tracking-label font-medium leading-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
