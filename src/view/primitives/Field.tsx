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
        <label className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#241F1C]/55">
          {label}
        </label>
        <input
          ref={ref}
          className={cn(
            "w-full h-[48px] px-[16px] font-sans text-[13px] text-[#241F1C] border border-[#241F1C]/30 bg-transparent transition-colors focus:outline-none focus:border-[#E8621B]",
            isAutofilled && "bg-[#F6EAD6] border-[#241F1C]/15",
            error && "border-[#B4470F]",
            className
          )}
          {...props}
        />
        {error && <span className="font-sans text-[11px] text-[#B4470F] mt-0.5">{error}</span>}
      </div>
    );
  }
);

Field.displayName = "Field";
