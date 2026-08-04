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
      "inline-flex items-center justify-center font-sans uppercase text-[12px] tracking-label font-medium h-12 md:h-14 px-6 transition-colors duration-hover ease-silk focus-visible:outline focus-visible:outline-2 focus-visible:outline-marigold focus-visible:outline-offset-[3px]";

    const variantStyles = {
      primary: "bg-saffron text-cream hover:bg-pressed active:bg-pressed",
      secondary: "bg-transparent text-ink border border-ink/35 hover:bg-ink/5",
      whatsapp: "bg-transparent text-peacock border border-peacock hover:bg-peacock/10",
      disabled: "bg-ink/12 text-ink/45 cursor-not-allowed",
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
