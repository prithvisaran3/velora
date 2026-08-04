"use client";

import React from "react";
import Link from "next/link";
import { TrustRow } from "../components/TrustRow";
import { Wordmark } from "@/view/primitives/Wordmark";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-cream pt-14 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">
          {/* Col 1: Logo & Tamil Line */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="group">
              <Wordmark fontSize={27} tone="ink" endorsement layout="stacked" className="items-start" />
            </Link>
            <div className="font-tamil text-[15px] text-cream/70 mt-2">
              ஈரோடு · 1977 முதல்
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-label-wide text-marigold">
              SHOP
            </span>
            <ul className="flex flex-col gap-2 font-sans text-[11px] tracking-[0.14em] text-cream/75 uppercase">
              <li><Link href="/colour/maroon" className="hover:text-turmeric transition-colors">By colour</Link></li>
              <li><Link href="/occasion/muhurtham" className="hover:text-turmeric transition-colors">By occasion</Link></li>
              <li><Link href="/saree/deep-maroon-mangai-zari-silk" className="hover:text-turmeric transition-colors">New in</Link></li>
              <li><Link href="/colour/maroon" className="hover:text-turmeric transition-colors">All sarees</Link></li>
            </ul>
          </div>

          {/* Col 3: HELP */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-label-wide text-marigold">
              HELP
            </span>
            <ul className="flex flex-col gap-2 font-sans text-[11px] tracking-[0.14em] text-cream/75 uppercase">
              <li><span className="cursor-pointer hover:text-turmeric transition-colors">Returns & exchange</span></li>
              <li><span className="cursor-pointer hover:text-turmeric transition-colors">Delivery timelines</span></li>
              <li><Link href="/track/VLR-4821" className="hover:text-turmeric transition-colors">Track your order</Link></li>
              <li><a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="hover:text-turmeric transition-colors">Ask on WhatsApp</a></li>
            </ul>
          </div>

          {/* Col 4: THE HOUSE */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-label-wide text-marigold">
              THE HOUSE
            </span>
            <ul className="flex flex-col gap-2 font-sans text-[11px] tracking-[0.14em] text-cream/75 uppercase">
              <li><Link href="/story" className="hover:text-turmeric transition-colors">Our story</Link></li>
              <li><span className="cursor-pointer hover:text-turmeric transition-colors">The Erode shop</span></li>
              <li><span className="cursor-pointer hover:text-turmeric transition-colors">Authenticity</span></li>
              <li><span className="cursor-pointer hover:text-turmeric transition-colors">Contact</span></li>
            </ul>
          </div>
        </div>

        {/* Marigold Hairline Divider */}
        <div className="h-[1px] bg-marigold/35 my-4" />

        {/* Trust Row */}
        <div className="py-4">
          <TrustRow />
        </div>
      </div>
    </footer>
  );
};
