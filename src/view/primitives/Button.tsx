"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "whatsapp" | "disabled";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth = false, className, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans uppercase text-[12px] tracking-[0.22em] font-medium h-[48px] md:h-[56px] px-6 transition-colors duration-[220ms] ease-silk focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F5A623] focus-visible:outline-offset-[3px]";

    const variantStyles = {
      primary: "bg-[#E8621B] text-[#FDF4E4] hover:bg-[#B4470F] active:bg-[#B4470F]",
      secondary: "bg-transparent text-[#241F1C] border border-[#241F1C]/35 hover:bg-[#241F1C]/5",
      whatsapp: "bg-transparent text-[#12514E] border border-[#12514E] hover:bg-[#12514E]/10",
      disabled: "bg-[#241F1C]/12 text-[#241F1C]/45 cursor-not-allowed",
    };

    const isEffectiveDisabled = disabled || variant === "disabled";

    return (
      <button
        ref={ref}
        disabled={isEffectiveDisabled}
        className={cn(
          baseStyles,
          variantStyles[isEffectiveDisabled ? "disabled" : variant],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
