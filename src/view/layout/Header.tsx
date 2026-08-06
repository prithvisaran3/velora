"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { useCart } from "@/viewmodel/client/useCart";
import { useAuth } from "@/viewmodel/client/useAuth";
import { AuthModal } from "@/view/components/AuthModal";
import { Wordmark } from "@/view/primitives/Wordmark";
import { BAG_PULSE_EVENT } from "@/three/store/flight";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/shop", label: "SHOP" },
  { href: "/colour/maroon", label: "BY COLOUR" },
  { href: "/story", label: "ATELIER" },
] as const;

/**
 * The header rule is a thread, so it takes the room's colour with everything
 * else — open a maroon saree and the line under the nav bleeds to maroon.
 */
export const Header: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // The bag pulses once when a flight lands.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onPulse = () => {
      setPulsing(true);
      timer = setTimeout(() => setPulsing(false), 620);
    };
    window.addEventListener(BAG_PULSE_EVENT, onPulse);
    return () => {
      window.removeEventListener(BAG_PULSE_EVENT, onPulse);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--page-bg)]">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-6 px-4 py-4 md:px-[60px] md:py-5">
          {/* The endorsement stays in the header and the footer, always. */}
          <Link href="/" className="flex-shrink-0">
            <Wordmark fontSize={24} tone="cream" endorsement sew className="items-start" />
          </Link>

          <nav className="hidden items-center gap-8 font-sans text-[10.5px] uppercase tracking-[0.24em] text-ink/72 md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-saffron">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-4 font-sans text-[10.5px] uppercase tracking-[0.24em] md:gap-6">
            {user ? (
              <span className="hidden items-center gap-2 md:flex">
                <span className="text-saffron">
                  {user.displayName?.split(" ")[0] || "ACCOUNT"}
                </span>
                <button
                  onClick={logout}
                  className="text-[9px] tracking-label text-ink/55 underline hover:text-ink"
                >
                  LOGOUT
                </button>
              </span>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden transition-colors hover:text-saffron md:block"
              >
                SIGN IN
              </button>
            )}

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="hidden transition-colors hover:text-saffron md:block"
            >
              WHATSAPP
            </a>

            <Link
              href="/bag"
              data-bag-target
              className={cn(
                "transition-colors",
                pulsing ? "bag-pulse text-[var(--thread)]" : "text-saffron hover:text-pressed"
              )}
            >
              BAG ({mounted ? cartCount : 0})
            </Link>

            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="tracking-label md:hidden"
              aria-label="Open menu"
            >
              MENU
            </button>
          </div>
        </div>

        <div className="rule-temple" />
      </header>

      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
