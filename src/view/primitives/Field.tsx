"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isAutofilled?: boolean;
}

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, isAutofilled, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="font-sans text-[10px] uppercase tracking-label-wide text-ink/55">
          {label}
        </label>
        <input
          ref={ref}
          className={cn(
            "w-full h-12 px-4 font-sans text-[13px] text-ink border border-ink/30 bg-transparent transition-colors focus:outline-none focus:border-saffron",
            isAutofilled && "bg-sand border-ink/15",
            error && "border-pressed",
            className
          )}
          {...props}
        />
        {error && <span className="font-sans text-[11px] text-pressed mt-0.5">{error}</span>}
      </div>
    );
  }
);

Field.displayName = "Field";
