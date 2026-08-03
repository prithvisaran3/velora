"use client";

import React from "react";
import { Swatch } from "../primitives/Swatch";
import { ColourKey } from "@/model/domain/types";
import { configFixture } from "@/model/fixtures/config.fixture";

interface ColourWheelProps {
  selectedColour?: ColourKey;
  onSelectColour?: (key: ColourKey) => void;
}

export const ColourWheel: React.FC<ColourWheelProps> = ({ selectedColour, onSelectColour }) => {
  const colours = Object.entries(configFixture.colours) as [
    ColourKey,
    { hex: string; label: { en: string; ta: string } }
  ][];

  return (
    <div className="flex items-center gap-4 overflow-x-auto py-3 px-1 no-scrollbar max-w-full">
      {colours.map(([key, config]) => (
        <Swatch
          key={key}
          colourKey={key}
          hex={config.hex}
          label={config.label.en}
          isSelected={selectedColour === key}
          onClick={() => onSelectColour?.(key)}
        />
      ))}
    </div>
  );
};
