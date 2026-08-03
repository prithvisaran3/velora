import React from "react";
import { Saree } from "@/model/domain/types";

interface SpecTableProps {
  saree: Saree;
}

export const SpecTable: React.FC<SpecTableProps> = ({ saree }) => {
  const specs = [
    { label: "FABRIC", value: saree.fabric },
    { label: "LENGTH", value: `${(saree.lengthCm / 100).toFixed(1)} meters` },
    { label: "BLOUSE PIECE", value: `${saree.blousePieceCm} cm attached` },
    { label: "ZARI WORK", value: saree.zari },
    { label: "CARE INSTRUCTIONS", value: saree.care },
    { label: "WEIGHT", value: `${saree.weightGrams} grams` },
  ];

  return (
    <div className="w-full border-t border-b border-[#241F1C]/12 py-4 my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
        {specs.map((spec, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#241F1C]/55">
              {spec.label}
            </span>
            <span className="font-sans text-[13px] text-[#241F1C] font-normal">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
