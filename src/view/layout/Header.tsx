"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { useCart } from "@/viewmodel/client/useCart";
import { useAuth } from "@/viewmodel/client/useAuth";
import { AuthModal } from "@/view/components/AuthModal";
import { Wordmark } from "@/view/primitives/Wordmark";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isDark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isDark = false }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Header background is fixed to brand Cream #FDF4E4 (or Ink #241F1C when isDark), never saree hues */}
      <header className={cn(
        "sticky top-0 z-40 border-b border-[#F5A623]/35 transition-colors duration-300",
        isDark ? "bg-[#241F1C] text-[#FDF4E4]" : "bg-[#FDF4E4] text-[#241F1C]"
      )}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-4 flex items-center justify-between">
          {/* Desktop Left Nav */}
          <nav className="hidden md:flex items-center gap-[28px] flex-shrink-0 whitespace-nowrap font-sans uppercase text-[11px] tracking-[0.2em] opacity-85">
            <Link href="/colour/maroon" className="hover:text-[#E8621B] transition-colors">SHOP BY COLOUR</Link>
            <Link href="/occasion/muhurtham" className="hover:text-[#E8621B] transition-colors">OCCASION</Link>
            <Link href="/offers" className="hover:text-[#E8621B] transition-colors font-medium text-[#E8621B]">OFFERS</Link>
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
          <Link href="/" className="group">
            <Wordmark fontSize={30} tone={isDark ? "ink" : "cream"} endorsement />
          </Link>

          {/* Desktop & Mobile Utilities */}
          <div className="flex items-center gap-[22px] flex-shrink-0 whitespace-nowrap font-sans uppercase text-[11px] tracking-[0.2em] opacity-85">
            {/* Customer Authentication Status */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#E8621B]">{user.displayName?.split(" ")[0] || "ACCOUNT"}</span>
                <button onClick={logout} className="text-[9px] opacity-60 hover:opacity-100 underline">
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:text-[#E8621B] transition-colors"
              >
                SIGN IN
              </button>
            )}

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

      {/* Brand Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
