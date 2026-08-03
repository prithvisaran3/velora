"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { useCart } from "@/viewmodel/client/useCart";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isDark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isDark = false }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 transition-colors duration-800 ease-silk border-b border-[#F5A623]/35",
        isDark ? "bg-[#241F1C] text-[#FDF4E4]" : "bg-[var(--page-bg,#FDF4E4)] text-[#241F1C]"
      )}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-4 flex items-center justify-between">
          {/* Desktop Left Nav */}
          <nav className="hidden md:flex items-center gap-[30px] flex-shrink-0 whitespace-nowrap font-sans uppercase text-[11px] tracking-[0.2em] opacity-85">
            <Link href="/colour/maroon" className="hover:text-[#E8621B] transition-colors">SHOP BY COLOUR</Link>
            <Link href="/occasion/muhurtham" className="hover:text-[#E8621B] transition-colors">OCCASION</Link>
            <Link href="/saree/deep-maroon-mangai-zari-silk" className="hover:text-[#E8621B] transition-colors">NEW IN</Link>
            <Link href="/story" className="hover:text-[#E8621B] transition-colors">OUR STORY</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden font-sans uppercase text-[12px] tracking-[0.2em] py-2"
          >
            MENU
          </button>

          {/* Centered Stacked Official Logo & Endorsement */}
          <Link href="/" className="flex flex-col items-center group text-center">
            <div className="flex items-end justify-center">
              <svg viewBox="0 0 100 124" className="w-[19px] h-[24px] mr-2">
                <path
                  d="M6 8 C 21 30 39 68 50 116 C 61 68 79 30 94 8 L 77 8 C 67 28 56 58 50 84 C 44 58 33 28 23 8 Z"
                  fill={isDark ? "#FDF4E4" : "#E8621B"}
                />
                <path d="M50 12 L55 19 L50 78 L45 19 Z" fill="#F5A623" />
                <path d="M37 91 L63 91 L63 98 L37 98 Z" fill="#F5A623" />
              </svg>
              <span className={cn(
                "font-display text-[28px] md:text-[30px] leading-[0.82] tracking-[0.28em] mr-[-0.28em]",
                isDark ? "text-[#FDF4E4]" : "text-[#241F1C]"
              )}>
                ELORA
              </span>
            </div>
            <span className={cn(
              "font-sans text-[7px] md:text-[8px] tracking-[0.34em] uppercase mr-[-0.34em] mt-[5px]",
              isDark ? "text-[#F5A623]" : "text-[#241F1C]/65"
            )}>
              BY BHARANI PATTU
            </span>
          </Link>

          {/* Desktop & Mobile Utilities */}
          <div className="flex items-center gap-[26px] flex-shrink-0 whitespace-nowrap font-sans uppercase text-[11px] tracking-[0.2em] opacity-85">
            <Link href="/track/VLR-4821" className="hidden md:block hover:text-[#E8621B] transition-colors">
              SEARCH
            </Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="hidden md:block hover:text-[#E8621B] transition-colors">
              WHATSAPP
            </a>
            <Link href="/bag" className="flex items-center gap-1.5 hover:text-[#E8621B] transition-colors font-medium">
              <span>BAG ({cartCount})</span>
            </Link>
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#F5A623] to-transparent opacity-80" />
      </header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
};
