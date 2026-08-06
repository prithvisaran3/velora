"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TamilText } from "../primitives/TamilText";
import { Wordmark } from "@/view/primitives/Wordmark";
import { ThreadField } from "@/view/thread/ThreadField";
import { useAuth } from "@/viewmodel/client/useAuth";
import { AuthModal } from "@/view/components/AuthModal";
import { UI } from "@/content/ui";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "All sarees" },
  { href: "/colour/maroon", label: UI.nav.shopByColour },
  { href: "/occasion/muhurtham", label: UI.nav.occasion },
  { href: "/offers", label: UI.nav.offers },
  { href: "/story", label: UI.nav.ourStory },
  { href: "/track/VLR-4821", label: "Track order" },
  { href: "/bag", label: UI.nav.bag },
] as const;

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-start bg-ink/60 backdrop-blur-sm">
        <div className="thread-ground relative flex h-full w-[84%] max-w-[330px] flex-col justify-between overflow-y-auto p-6">
          <ThreadField variant="panel" className="opacity-60" />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex items-start justify-between border-b border-ink/15 pb-4">
              <Wordmark fontSize={22} tone="cream" endorsement className="items-start" />
              <button onClick={onClose} className="p-1 font-sans text-[20px] text-ink" aria-label="Close menu">
                ✕
              </button>
            </div>

            <div className="border border-ink/15 bg-panel p-3">
              {user ? (
                <div className="flex w-full items-center justify-between">
                  <span className="font-sans text-[11px] font-medium text-saffron">
                    {user.displayName?.split(" ")[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="font-sans text-[9px] uppercase tracking-wider text-ink/65 underline"
                  >
                    LOGOUT
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full text-left font-sans text-[11px] font-medium uppercase tracking-label text-saffron"
                >
                  SIGN IN / CREATE ACCOUNT
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-1 font-sans text-[13px] uppercase tracking-label text-ink">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex min-h-11 items-center text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="relative z-10 flex flex-col gap-2 border-t border-ink/15 pt-6">
            <span className="font-sans text-[10px] uppercase tracking-label-wide text-ink/55">
              BY PRIYA MAHADEVAN
            </span>
            <TamilText className="text-[12px] text-ink/70">ஈரோடு</TamilText>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
