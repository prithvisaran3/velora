"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "whatsapp" | "disabled";
  fullWidth?: boolean;
  /** A specular pass across a filled button, once every few seconds. */
  glint?: boolean;
}

/**
 * One easing everywhere: cubic-bezier(.16, 1, .3, 1). Nothing bounces, nothing
 * springs. A secondary button widens its letterspacing on hover instead of
 * changing shape — the thread tightening, not a control popping.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", fullWidth = false, glint = false, className, children, disabled, ...props },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center overflow-hidden font-sans uppercase text-[11px] tracking-[0.24em] font-medium h-12 md:h-14 px-7 transition-all duration-500 ease-silk focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--thread)] focus-visible:outline-offset-[3px]";

    const variantStyles = {
      primary:
        "bg-saffron text-panel hover:bg-pressed hover:-translate-y-[3px] hover:shadow-[0_16px_26px_-12px_rgba(120,84,40,0.7)]",
      secondary:
        "bg-transparent text-ink border border-ink/30 hover:border-saffron hover:text-saffron hover:tracking-[0.3em]",
      whatsapp:
        "bg-transparent text-peacock border border-peacock hover:bg-peacock/10",
      disabled: "bg-ink/12 text-ink/45 cursor-not-allowed",
    };

    const isEffectiveDisabled = disabled || variant === "disabled";
    const resolved = isEffectiveDisabled ? "disabled" : variant;

    return (
      <button
        ref={ref}
        disabled={isEffectiveDisabled}
        className={cn(baseStyles, variantStyles[resolved], fullWidth && "w-full", className)}
        {...props}
      >
        {children}
        {glint && resolved === "primary" && (
          <span
            className="thread-glint pointer-events-none absolute inset-y-0 w-[30%]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,240,214,0.32), transparent)",
            }}
            aria-hidden
          />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
