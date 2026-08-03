import { MoneyPaise, paise } from "./types";

export const Money = {
  fromPaise: (n: number): MoneyPaise => paise(n),
  formatINR: (amountInPaise: MoneyPaise): string => {
    const rupees = amountInPaise / 100;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(rupees);
  },
  formatRupees: (amountInPaise: MoneyPaise): string => {
    const rupees = Math.round(amountInPaise / 100);
    return `₹${rupees.toLocaleString("en-IN")}`;
  },
};
