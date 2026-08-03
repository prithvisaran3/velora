"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface WhatsAppFabProps {
  hasStickyBar?: boolean;
}

export const WhatsAppFab: React.FC<WhatsAppFabProps> = ({ hasStickyBar = false }) => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=Hello%20Velora%2C%20I%20have%20a%20question%20about%20a%20saree.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Ask on WhatsApp"
      className={cn(
        "fixed right-4 z-40 w-[52px] h-[52px] rounded-full bg-[#12514E] text-[#FDF4E4] flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#F5A623]",
        hasStickyBar ? "bottom-[94px]" : "bottom-6"
      )}
    >
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
      </svg>
    </a>
  );
};
