"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TamilText } from "../primitives/TamilText";
import { useAuth } from "@/viewmodel/client/useAuth";
import { AuthModal } from "@/view/components/AuthModal";

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
      <div className="fixed inset-0 z-50 bg-[#241F1C]/60 backdrop-blur-sm flex justify-start">
        <div className="w-[80%] max-w-[320px] bg-[#FDF4E4] h-full p-6 flex flex-col justify-between overflow-y-auto">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-[#241F1C]/15 pb-4">
              <span className="wordmark text-[22px] text-ink font-normal">VELORA</span>
              <button onClick={onClose} className="text-[20px] font-sans text-ink p-1">
                ✕
              </button>
            </div>

            {/* Customer Authentication Bar */}
            <div className="bg-white p-3 border border-[#241F1C]/15 flex items-center justify-between">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <span className="font-sans text-[11px] font-bold text-[#E8621B]">{user.displayName?.split(" ")[0]}</span>
                  <button onClick={logout} className="font-sans text-[9px] uppercase tracking-wider underline text-[#241F1C]/65">LOGOUT</button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full text-left font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-[#E8621B]"
                >
                  🔑 SIGN IN / CREATE ACCOUNT
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-5 font-sans text-[13px] uppercase tracking-[0.2em] text-[#241F1C]">
              <Link href="/" onClick={onClose}>Home</Link>
              <Link href="/colour/maroon" onClick={onClose}>Shop by Colour</Link>
              <Link href="/occasion/muhurtham" onClick={onClose}>Shop by Occasion</Link>
              <Link href="/offers" onClick={onClose} className="text-[#E8621B] font-bold">Offers & Coupons</Link>
              <Link href="/story" onClick={onClose}>Our Story</Link>
              <Link href="/track/VLR-4821" onClick={onClose}>Track Order</Link>
              <Link href="/bag" onClick={onClose}>Shopping Bag</Link>
              <Link href="/admin" onClick={onClose} className="text-[11px] opacity-75">Admin Portal</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-2 pt-6 border-t border-[#241F1C]/15">
            <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#241F1C]/55">
              BHARANI PATTU CENTRE
            </span>
            <TamilText className="text-[12px] text-[#241F1C]/70">
              ஈரோடு · 1978 முதல்
            </TamilText>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
