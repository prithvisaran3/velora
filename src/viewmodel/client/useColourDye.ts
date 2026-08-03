"use client";

import { useEffect } from "react";
import { configFixture } from "@/model/fixtures/config.fixture";
import { ColourKey } from "@/model/domain/types";

export function useColourDye(selectedColour?: ColourKey) {
  useEffect(() => {
    const htmlElement = document.documentElement;

    if (!selectedColour || !configFixture.colours[selectedColour]) {
      htmlElement.style.setProperty("--page-bg", "#FDF4E4");
      htmlElement.style.setProperty("--page-fg", "#241F1C");
      return;
    }

    const hex = configFixture.colours[selectedColour].hex;
    htmlElement.style.setProperty("--page-bg", hex);

    // Dark background hues get light cream text contrast
    const darkHues: ColourKey[] = ["maroon", "peacock", "indigo", "plum"];
    if (darkHues.includes(selectedColour)) {
      htmlElement.style.setProperty("--page-fg", "#FDF4E4");
    } else {
      htmlElement.style.setProperty("--page-fg", "#241F1C");
    }

    return () => {
      htmlElement.style.setProperty("--page-bg", "#FDF4E4");
      htmlElement.style.setProperty("--page-fg", "#241F1C");
    };
  }, [selectedColour]);
}
