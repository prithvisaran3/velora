import React from "react";

export const TrustRow: React.FC = () => {
  const trustItems = [
    "COD AVAILABLE",
    "GST INVOICE",
    "7-DAY RETURN",
    "SHIPS ACROSS INDIA 3–6 DAYS",
    "UPI",
    "CARDS",
    "NETBANKING",
  ];

  return (
    <div className="w-full border-t border-b border-marigold/35 py-4 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between gap-6 min-w-max text-[10px] md:text-[11px] font-sans uppercase tracking-label text-ink/75">
        {trustItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <span>{item}</span>
            {idx < trustItems.length - 1 && <span className="text-marigold">•</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
