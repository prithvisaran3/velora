"use client";

import React, { useState } from "react";
import { useAuth } from "@/viewmodel/client/useAuth";
import { Wordmark } from "@/view/primitives/Wordmark";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const { signUpWithEmail, signInWithEmail, signInWithGoogle } = useAuth();

  // Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    const res = await signInWithGoogle();
    if (res.ok) {
      onClose();
    } else {
      setErrorMsg(res.error || "Google Sign-In failed");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const res = await signInWithEmail(email, password);
    setIsSubmitting(false);

    if (res.ok) {
      onClose();
    } else {
      setErrorMsg(res.error || "Sign-In failed. Please check your credentials.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const res = await signUpWithEmail(name, email, phone, password);
    setIsSubmitting(false);

    if (res.ok) {
      alert("🎉 Account created successfully!");
      onClose();
    } else {
      setErrorMsg(res.error || "Account creation failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[440px] bg-cream border border-ink/20 shadow-none p-6 md:p-8 flex flex-col gap-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink/60 hover:text-ink font-mono text-[16px] p-2"
        >
          ✕
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-1">
          <Wordmark fontSize={24} tone="cream" endorsement />
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-ink/15">
          <button
            onClick={() => { setTab("signin"); setErrorMsg(""); }}
            className={`flex-1 py-3 font-sans text-[11px] uppercase tracking-[0.2em] font-medium border-b-2 transition-colors ${
              tab === "signin" ? "border-saffron text-saffron" : "border-transparent text-ink/50"
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => { setTab("signup"); setErrorMsg(""); }}
            className={`flex-1 py-3 font-sans text-[11px] uppercase tracking-[0.2em] font-medium border-b-2 transition-colors ${
              tab === "signup" ? "border-saffron text-saffron" : "border-transparent text-ink/50"
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* One-Click Google Auth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-ink border border-ink/25 py-3 font-sans text-[11px] tracking-[0.16em] uppercase font-bold flex items-center justify-center gap-3 hover:border-saffron transition-colors shadow-none"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-ink/15" />
          <span className="font-sans text-[9px] uppercase tracking-widest text-ink/40">OR</span>
          <div className="flex-1 h-[1px] bg-ink/15" />
        </div>

        {/* Error message alert */}
        {errorMsg && (
          <div className="bg-pressed/10 border border-pressed/30 p-3 text-center">
            <span className="font-sans text-[11px] text-pressed font-medium">{errorMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {tab === "signin" && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-sans text-[9px] uppercase tracking-label text-ink/70">EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full border border-ink/25 p-3 font-sans text-[12px] bg-transparent text-ink focus:outline-none focus:border-saffron"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-sans text-[9px] uppercase tracking-label text-ink/70">PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-ink/25 p-3 font-sans text-[12px] bg-transparent text-ink focus:outline-none focus:border-saffron"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-saffron text-cream py-3.5 font-sans text-[11px] tracking-[0.22em] uppercase font-bold mt-2 hover:bg-pressed transition-colors"
            >
              {isSubmitting ? "SIGNING IN..." : "SIGN IN TO STORE"}
            </button>
          </form>
        )}

        {/* CREATE ACCOUNT FORM */}
        {tab === "signup" && (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-sans text-[9px] uppercase tracking-label text-ink/70">FULL NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Sundaram"
                className="w-full border border-ink/25 p-3 font-sans text-[12px] bg-transparent text-ink focus:outline-none focus:border-saffron"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-sans text-[9px] uppercase tracking-label text-ink/70">EMAIL</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full border border-ink/25 p-3 font-sans text-[12px] bg-transparent text-ink focus:outline-none focus:border-saffron"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-sans text-[9px] uppercase tracking-label text-ink/70">MOBILE (10 DIGITS)</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full border border-ink/25 p-3 font-sans text-[12px] bg-transparent text-ink focus:outline-none focus:border-saffron"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-sans text-[9px] uppercase tracking-label text-ink/70">PASSWORD</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full border border-ink/25 p-3 font-sans text-[12px] bg-transparent text-ink focus:outline-none focus:border-saffron"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-saffron text-cream py-3.5 font-sans text-[11px] tracking-[0.22em] uppercase font-bold mt-2 hover:bg-pressed transition-colors"
            >
              {isSubmitting ? "CREATING ACCOUNT..." : "CREATE VELORA ACCOUNT"}
            </button>
          </form>
        )}

        {/* GUEST SHOPPING OPTION */}
        <div className="pt-2 border-t border-ink/10 text-center">
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-[10px] tracking-label uppercase text-ink/65 hover:text-saffron underline"
          >
            CONTINUE AS GUEST (NO LOGIN REQUIRED)
          </button>
        </div>
      </div>
    </div>
  );
};
