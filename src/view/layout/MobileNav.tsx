"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TamilText } from "../primitives/TamilText";
import { useAuth } from "@/viewmodel/client/useAuth";
import { AuthModal } from "@/view/components/AuthModal";
import { UI } from "@/content/ui";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex justify-start">
        <div className="w-[80%] max-w-[320px] bg-cream h-full p-6 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-ink/15 pb-4">
              <span className="wordmark text-[22px] text-ink font-normal">VELORA</span>
              <button onClick={onClose} className="text-[20px] font-sans text-ink p-1">
                ✕
              </button>
            </div>

            {/* Customer Authentication Bar */}
            <div className="bg-white p-3 border border-ink/15 flex items-center justify-between">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <span className="font-sans text-[11px] font-bold text-saffron">{user.displayName?.split(" ")[0]}</span>
                  <button onClick={logout} className="font-sans text-[9px] uppercase tracking-wider underline text-ink/65">LOGOUT</button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full text-left font-sans text-[11px] uppercase tracking-label font-bold text-saffron"
                >
                  🔑 SIGN IN / CREATE ACCOUNT
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-5 font-sans text-[13px] uppercase tracking-label text-ink">
              <Link href="/" onClick={onClose}>Home</Link>
              <Link href="/colour/maroon" onClick={onClose}>{UI.nav.shopByColour}</Link>
              <Link href="/occasion/muhurtham" onClick={onClose}>{UI.nav.occasion}</Link>
              <Link href="/offers" onClick={onClose} className="text-saffron font-bold">{UI.nav.offers} & Coupons</Link>
              <Link href="/story" onClick={onClose}>{UI.nav.ourStory}</Link>
              <Link href="/track/VLR-4821" onClick={onClose}>Track Order</Link>
              <Link href="/bag" onClick={onClose}>Shopping Bag</Link>
              <Link href="/admin" onClick={onClose} className="text-[11px] opacity-75">Admin Portal</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-2 pt-6 border-t border-ink/15">
            <span className="font-sans text-[10px] uppercase tracking-label-wide text-ink/55">
              BY PRIYA MAHADEVAN
            </span>
            <TamilText className="text-[12px] text-ink/70">
              ஈரோடு
            </TamilText>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
