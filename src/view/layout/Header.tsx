"use client";

import React, { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 border-b border-marigold/35 transition-colors duration-300",
        isDark ? "bg-ink text-cream" : "bg-cream text-ink"
      )}>
        <div className="max-w-[1440px] mx-auto px-gutter md:px-gutter-lg py-4 flex items-center justify-between gap-9">
          {/* Desktop Left Nav */}
          <nav className="hidden md:flex items-center gap-7 flex-shrink-0 whitespace-nowrap font-sans uppercase text-[11px] tracking-label opacity-85">
            <Link href="/colour/maroon" className="hover:text-saffron transition-colors">SHOP BY COLOUR</Link>
            <Link href="/occasion/muhurtham" className="hover:text-saffron transition-colors">OCCASION</Link>
            <Link href="/offers" className="hover:text-saffron transition-colors font-medium text-saffron">OFFERS</Link>
            <Link href="/saree/deep-maroon-mangai-zari-silk" className="hover:text-saffron transition-colors">NEW IN</Link>
            <Link href="/story" className="hover:text-saffron transition-colors">OUR STORY</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden font-sans uppercase text-[12px] tracking-label py-2"
          >
            MENU
          </button>

          {/* Centered Stacked Official Logo & Endorsement */}
          <Link href="/" className="group flex-shrink-0">
            <Wordmark fontSize={30} tone={isDark ? "ink" : "cream"} endorsement />
          </Link>

          {/* Desktop & Mobile Utilities */}
          <div className="flex items-center gap-[22px] flex-shrink-0 whitespace-nowrap font-sans uppercase text-[11px] tracking-label opacity-85">
            {/* Customer Authentication Status */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="font-medium text-saffron">{user.displayName?.split(" ")[0] || "ACCOUNT"}</span>
                <button onClick={logout} className="text-[9px] opacity-60 hover:opacity-100 underline">
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:text-saffron transition-colors"
              >
                SIGN IN
              </button>
            )}

            <Link href="/track/VLR-4821" className="hidden md:block hover:text-saffron transition-colors">
              SEARCH
            </Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="hidden md:block hover:text-saffron transition-colors">
              WHATSAPP
            </a>
            <Link href="/bag" className="flex items-center gap-1.5 hover:text-saffron transition-colors font-medium">
              <span>BAG ({mounted ? cartCount : 0})</span>
            </Link>
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="rule-temple opacity-80" />
      </header>

      {/* Mobile Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Brand Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
