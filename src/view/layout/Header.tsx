"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { useOverHero } from "./useOverHero";
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
 * The nav lives inside the hero, not in a band above it.
 *
 * Over the hero the header has no fill and no rule: it sits directly on the
 * thread ground, on the same measure as the headline beneath it, which is what
 * stops the site reading as old chrome wrapping new work. Once the hero has
 * scrolled past, it takes the page ground and its rule — with the dye
 * transition, so it never jumps while <html> bleeds underneath.
 *
 * The state comes from an IntersectionObserver on the hero itself rather than
 * a scrollY threshold, so it is correct at any hero height and on any route:
 * no `[data-hero]` in the document means solid from the first paint.
 */
export const Header: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  /** Transparent on the thread ground, solid once the hero is behind us. */
  const overHero = useOverHero();

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
      <header className="sticky top-0 z-40">
        {/*
          The fill is a layer, not a background-color transition on the header.

          Those are two different jobs and putting both on one property breaks
          the dye: a `transition: background-color` here makes the header run
          its own 900ms journey toward the new --page-bg instead of simply
          painting the value that is already animating on :root — and the two
          curves drift apart, which is the tear. Measured at 25 torn frames in
          152 when this was `transition-colors`.

          So: background-color is plain and inherits the dye frame for frame,
          and only opacity animates when the hero scrolls away.
        */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-[var(--page-bg)] transition-opacity duration-dye ease-silk",
            overHero ? "opacity-0" : "opacity-100"
          )}
          aria-hidden
        />
        {/* Exactly --header-h tall, so the hero's negative pull and the
            observer's margin are the same number as the real box. */}
        <div className="measure relative flex h-[var(--header-h)] items-center justify-between gap-6">
          {/* No endorsement here: it belongs to the footer and the drawer. */}
          <Link
            href="/"
            className="flex min-h-11 flex-shrink-0 items-center"
            aria-label="Velora — home"
          >
            <Wordmark fontSize={24} tone="cream" endorsement={false} sew />
          </Link>

          <nav className="hidden items-center gap-8 font-sans text-[10.5px] uppercase tracking-[0.24em] text-ink/72 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                /* The colour has to live on the link: the base `a` rule beats
                   a text-* utility inherited from the nav. */
                className="text-ink/72 transition-colors hover:text-saffron"
              >
                {item.label}
              </Link>
            ))}

            {/* BAG closes the nav, with the account folded into its cluster —
                one right-hand group, not three competing ones. */}
            <span className="flex items-center gap-4">
              {user ? (
                <span className="flex items-center gap-2">
                  <span className="text-ink/72">
                    {user.displayName?.split(" ")[0] || "ACCOUNT"}
                  </span>
                  <button
                    onClick={logout}
                    className="text-[9px] tracking-label text-ink/55 transition-colors hover:text-ink"
                  >
                    LOGOUT
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-ink/72 transition-colors hover:text-saffron"
                >
                  SIGN IN
                </button>
              )}
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
            </span>
          </nav>

          {/* Mobile: bag stays reachable, everything else is in the drawer. */}
          <div className="flex flex-shrink-0 items-center gap-1 font-sans text-[10.5px] uppercase tracking-[0.24em] md:hidden">
            <Link
              href="/bag"
              data-bag-target
              className={cn(
                "flex min-h-11 items-center px-2 transition-colors",
                pulsing ? "bag-pulse text-[var(--thread)]" : "text-saffron"
              )}
            >
              BAG ({mounted ? cartCount : 0})
            </Link>
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="flex min-h-11 items-center px-2 tracking-label"
              aria-label="Open menu"
            >
              MENU
            </button>
          </div>
        </div>

        {/* The rule belongs to the solid state only — over the hero the thread
            ground is already the edge. Absolute, so it never adds to the
            header's height. */}
        <div
          className={cn(
            "rule-temple absolute inset-x-0 bottom-0 transition-opacity duration-dye ease-silk",
            overHero ? "opacity-0" : "opacity-100"
          )}
        />
      </header>

      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
