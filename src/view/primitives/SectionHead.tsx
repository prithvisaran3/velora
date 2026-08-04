import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export const SectionHead: React.FC<SectionHeadProps> = ({
  children,
  subtitle,
  className,
  align = "left",
}) => {
  const alignment = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={cn("flex flex-col gap-2", alignment[align], className)}>
      <h2 className="font-display text-[26px] md:text-[44px] text-ink font-normal leading-tight">
        {children}
      </h2>
      {subtitle && (
        <p className="font-sans text-[13px] md:text-[15px] text-ink/78 max-w-measure">
          {subtitle}
        </p>
      )}
    </div>
  );
};
