import { Paise, paise } from "./types";

export const Money = {
  fromPaise: (n: number): Paise => paise(n),
  
  fromRupees: (rupees: number): Paise => {
    if (!Number.isFinite(rupees) || rupees < 0) throw new Error(`Invalid rupees: ${rupees}`);
    return paise(Math.round(rupees * 100));
  },

  formatRupees: (p: Paise): string => {
    const rupees = Math.floor(p / 100);
    return `₹${rupees.toLocaleString("en-IN")}`;
  },

  add: (a: Paise, b: Paise): Paise => paise(a + b),
};
