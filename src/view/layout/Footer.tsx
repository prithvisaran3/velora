import React from "react";
import Link from "next/link";
import { TrustRow } from "../components/TrustRow";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#241F1C] text-[#FDF4E4] pt-14 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">
          {/* Col 1: Logo & Tamil Line */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex flex-col items-start group">
              <div className="flex items-end justify-start">
                <svg viewBox="0 0 100 124" className="w-[20px] h-[25px] mr-2">
                  <path d="M6 8 C 21 30 39 68 50 116 C 61 68 79 30 94 8 L 77 8 C 67 28 56 58 50 84 C 44 58 33 28 23 8 Z" fill="#FDF4E4" />
                  <path d="M50 12 L55 19 L50 78 L45 19 Z" fill="#F5A623" />
                  <path d="M37 91 L63 91 L63 98 L37 98 Z" fill="#F5A623" />
                </svg>
                <span className="font-display text-[31px] leading-[0.82] tracking-[0.28em] text-[#FDF4E4] mr-[-0.28em]">
                  ELORA
                </span>
              </div>
              <span className="font-sans text-[8px] tracking-[0.34em] uppercase text-[#F5A623] mr-[-0.34em] mt-[6px]">
                BY BHARANI PATTU
              </span>
            </Link>
            <div className="font-tamil text-[15px] text-[#FDF4E4]/70 mt-2">
              ஈரோடு · 1978 முதல்
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.26em] text-[#F5A623]">
              SHOP
            </span>
            <ul className="flex flex-col gap-2 font-sans text-[11px] tracking-[0.14em] text-[#FDF4E4]/75 uppercase">
              <li><Link href="/colour/maroon" className="hover:text-[#F8CE5A] transition-colors">By colour</Link></li>
              <li><Link href="/occasion/muhurtham" className="hover:text-[#F8CE5A] transition-colors">By occasion</Link></li>
              <li><Link href="/saree/deep-maroon-mangai-zari-silk" className="hover:text-[#F8CE5A] transition-colors">New in</Link></li>
              <li><Link href="/colour/maroon" className="hover:text-[#F8CE5A] transition-colors">All sarees</Link></li>
            </ul>
          </div>

          {/* Col 3: HELP */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.26em] text-[#F5A623]">
              HELP
            </span>
            <ul className="flex flex-col gap-2 font-sans text-[11px] tracking-[0.14em] text-[#FDF4E4]/75 uppercase">
              <li><span className="cursor-pointer hover:text-[#F8CE5A]">Returns & exchange</span></li>
              <li><span className="cursor-pointer hover:text-[#F8CE5A]">Delivery timelines</span></li>
              <li><Link href="/track/VLR-4821" className="hover:text-[#F8CE5A] transition-colors">Track your order</Link></li>
              <li><a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="hover:text-[#F8CE5A] transition-colors">Ask on WhatsApp</a></li>
            </ul>
          </div>

          {/* Col 4: THE HOUSE */}
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-[0.26em] text-[#F5A623]">
              THE HOUSE
            </span>
            <ul className="flex flex-col gap-2 font-sans text-[11px] tracking-[0.14em] text-[#FDF4E4]/75 uppercase">
              <li><Link href="/story" className="hover:text-[#F8CE5A] transition-colors">Our story</Link></li>
              <li><span className="cursor-pointer hover:text-[#F8CE5A]">The Erode shop</span></li>
              <li><span className="cursor-pointer hover:text-[#F8CE5A]">Authenticity</span></li>
              <li><span className="cursor-pointer hover:text-[#F8CE5A]">Contact</span></li>
            </ul>
          </div>
        </div>

        {/* Marigold Hairline Divider */}
        <div className="h-[1px] bg-[#F5A623]/35 my-4" />

        {/* Trust Row */}
        <div className="py-4">
          <TrustRow />
        </div>
      </div>
    </footer>
  );
};
