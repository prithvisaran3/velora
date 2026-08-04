import type { Config } from "tailwindcss";

/**
 * Velora — Tailwind v4 supplementary config.
 * Primary tokens live in globals.css under @theme. This file only carries
 * what the CSS-first config cannot express: safelisting of saree hues
 * used dynamically by the colour-dye page.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  // Saree hues are applied from Firestore data at runtime; keep them in the build.
  safelist: [
    { pattern: /^(bg|text|ring|border)-saree-(maroon|peacock|indigo|leaf|plum|kora)$/ },
  ],
  plugins: [],
};

export default config;
