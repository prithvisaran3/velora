import type { Config } from "tailwindcss";

/**
 * Velora — Tailwind config.
 * Tokens live in globals.css under @theme (Tailwind v4). This file only carries
 * what the CSS-first config cannot express, plus explicit safelisting of the
 * saree hues used dynamically by the colour-dye page.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      borderRadius: { none: "0" },
      aspectRatio: { saree: "3 / 4", tile: "4 / 5" },
      maxWidth: { measure: "62ch", checkout: "720px", media: "840px" },
      spacing: {
        gutter: "18px",
        "gutter-lg": "64px",
        "sticky-bar": "96px",   // bottom padding reserved for the mobile buy bar
        "fab-gutter": "60px",   // right gutter reserved under the WhatsApp FAB
      },
      transitionTimingFunction: { silk: "cubic-bezier(0.16, 1, 0.3, 1)" },
      transitionDuration: {
        hover: "220ms",
        crossfade: "600ms",
        flight: "720ms",
        wipe: "780ms",
        dye: "800ms",
        draw: "900ms",
      },
      letterSpacing: {
        wordmark: "0.28em",
        endorsement: "0.34em",
        label: "0.2em",
        "label-wide": "0.3em",
      },
      fontSize: {
        // display scale — clamp so mobile is the primary design, not a scaled-down desktop
        "display-xl": ["clamp(3rem, 7vw, 6.5rem)", { lineHeight: "0.96" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4.75rem)", { lineHeight: "1" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.05" }],
        "display-sm": ["clamp(1.25rem, 2vw, 1.375rem)", { lineHeight: "1.2" }],
      },
    },
  },
  // Saree hues are applied from Firestore data at runtime; keep them in the build.
  safelist: [
    { pattern: /^(bg|text|ring|border)-saree-(maroon|peacock|indigo|leaf|plum|kora)$/ },
  ],
  plugins: [],
};

export default config;
