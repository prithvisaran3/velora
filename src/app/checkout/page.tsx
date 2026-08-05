"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/viewmodel/client/useCart";
import { useAuth } from "@/viewmodel/client/useAuth";
import { Money } from "@/model/domain/money";
import { Price } from "@/view/primitives/Price";
import { Button } from "@/view/primitives/Button";
import { Wordmark } from "@/view/primitives/Wordmark";
import { ThreadStepper } from "@/view/thread/ThreadStepper";
import { ThreadRule } from "@/view/thread/ThreadRule";
import { applyCoupon } from "@/viewmodel/actions/applyCoupon";
import { UI } from "@/content/ui";
import { cn } from "@/lib/utils";

type PaymentMethod = "upi" | "cod" | "card";

const PAYMENTS: Array<{ key: PaymentMethod; title: string; note?: string }> = [
  { key: "upi", title: "UPI — GPay, PhonePe, Paytm", note: "Most Velora orders are paid this way" },
  { key: "cod", title: "Cash on delivery" },
  { key: "card", title: "Card / Netbanking" },
];

const FIELD =
  "w-full border border-ink/30 bg-transparent p-[15px] px-4 font-sans text-[13px] text-ink focus:border-saffron focus:outline-none";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { user, signInWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [discountPaise, setDiscountPaise] = useState(0);
  const [appliedCouponName, setAppliedCouponName] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  useEffect(() => {
    if (user?.displayName) setName((current) => current || user.displayName || "");
  }, [user]);

  // Every saree in the bag is charged for, not just the first one.
  const subtotalPaise = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.priceInPaise, 0),
    [cartItems]
  );
  const finalTotalPaise = Math.max(0, subtotalPaise - discountPaise);

  const handleApplyCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");
    if (!couponCode.trim()) return;

    const res = await applyCoupon(couponCode, Money.fromPaise(subtotalPaise));
    if (res.ok) {
      setDiscountPaise(res.data.discountInPaise);
      setAppliedCouponName(res.data.code);
      setCouponSuccess(
        `Coupon ${res.data.code} applied — you saved ${Money.formatRupees(
          Money.fromPaise(res.data.discountInPaise)
        )}.`
      );
    } else {
      setCouponError(res.error.message);
    }
  };

  const handlePincodeBlur = () => {
    if (/^(63|60|64)/.test(pincode)) {
      setCity("Erode");
      setState("Tamil Nadu");
    } else if (pincode.startsWith("56")) {
      setCity("Bengaluru");
      setState("Karnataka");
    }
  };

  const handleSubmitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    setSubmitError("");

    const reference = `VLR-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const { db } = await import("@/infrastructure/firebase/client");
      const { collection, addDoc } = await import("firebase/firestore");
      const now = new Date().toISOString();

      await addDoc(collection(db, "orders"), {
        reference,
        status: paymentMethod === "cod" ? "pending" : "paid",
        items: cartItems.map((item) => ({
          sareeId: item.id,
          slug: item.slug,
          title: item.title,
          priceInPaise: item.priceInPaise,
          imageId: item.images[0]?.id || "",
        })),
        totals: {
          subtotalInPaise: subtotalPaise,
          discountInPaise: discountPaise,
          shippingInPaise: 0,
          totalInPaise: finalTotalPaise,
        },
        customer: { name, phone },
        address: { line1: addressLine, city, state, pincode },
        payment: { method: paymentMethod },
        timeline: [
          { status: "pending", at: now, note: `Order placed via ${paymentMethod.toUpperCase()}` },
          ...(paymentMethod !== "cod" ? [{ status: "paid", at: now, note: "Payment captured" }] : []),
        ],
        createdAt: now,
        updatedAt: now,
      });

      clearCart();
      router.push(`/track/${reference}`);
    } catch (error) {
      console.error("Failed to save order", error);
      setIsSubmitting(false);
      setSubmitError("We could not place that order. Please try again, or ask on WhatsApp.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 px-6 py-24 text-center">
        <p className="m-0 font-display text-[22px] text-ink/65">{UI.bag.empty}</p>
        <Link href="/shop">
          <Button variant="primary">{UI.bag.emptyCta}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center gap-6 border-b border-ink/12 py-6">
        <Link href="/">
          <Wordmark fontSize={26} tone="cream" endorsement />
        </Link>
        <div className="w-full max-w-[560px] px-6">
          <ThreadStepper steps={UI.checkout.steps} current={1} />
        </div>
      </div>

      <div className="flex w-full max-w-[720px] flex-col gap-9 px-4 py-12 md:px-6">
        <h1 className="font-display text-[36px] md:text-[46px]">{UI.checkout.heading}</h1>

        {!user ? (
          <div className="flex flex-col items-start justify-between gap-3 border border-ink/15 bg-panel p-4 sm:flex-row sm:items-center">
            <div className="flex flex-col">
              <span className="font-sans text-[12px] font-medium">Have a Google account?</span>
              <span className="font-sans text-[10px] text-ink/70">
                Sign in to auto-fill your name and delivery details
              </span>
            </div>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="border border-ink/25 bg-[var(--page-bg)] px-4 py-2 font-sans text-[10px] font-medium uppercase tracking-wider hover:border-saffron"
            >
              SIGN IN WITH GOOGLE
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-peacock px-4 py-3 text-panel">
            <span className="font-sans text-[12px]">Signed in as {user.displayName}</span>
            <span className="font-sans text-[9px] uppercase tracking-widest opacity-80">
              EXPRESS CHECKOUT
            </span>
          </div>
        )}

        {/* What is being bought */}
        <ul className="m-0 flex list-none flex-col gap-5 p-0">
          {cartItems.map((item) => {
            const photo = item.images[0]?.id;
            const hasPhoto = !!photo && !photo.includes("icon-flat");
            return (
              <li key={item.id} className="flex gap-5 border-b border-ink/15 pb-5">
                <div className="relative h-[130px] w-[98px] flex-shrink-0 overflow-hidden border border-ink/10 bg-sand">
                  {hasPhoto ? (
                    <Image
                      src={photo}
                      alt={item.title.en}
                      fill
                      unoptimized={photo.startsWith("data:")}
                      sizes="98px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(168deg, ${item.colour.hex}, var(--color-ink))`,
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <h2 className="font-display text-[19px] md:text-[22px]">{item.title.en}</h2>
                  <span className="font-sans text-[11px] text-ink/65">{item.fabric}</span>
                  <span className="mt-1 font-sans text-[10px] font-medium uppercase tracking-label text-pressed">
                    {UI.pdp.onlyOne}
                  </span>
                </div>
                <Price amountInPaise={item.priceInPaise} className="font-display text-[19px]" />
              </li>
            );
          })}
        </ul>

        {/* Coupon */}
        <div className="flex flex-col gap-3 border border-ink/15 bg-panel p-5">
          <span className="font-sans text-[10px] font-medium uppercase tracking-label-wide text-saffron">
            PROMO CODE
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter a code"
              aria-label="Promo code"
              className="flex-1 border border-ink/30 bg-transparent p-3 font-mono text-[13px] focus:border-saffron focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-ink px-5 font-sans text-[10px] font-medium uppercase tracking-label text-panel transition-colors hover:bg-pressed"
            >
              APPLY
            </button>
          </div>
          {couponSuccess && (
            <span className="font-sans text-[11px] font-medium text-peacock">{couponSuccess}</span>
          )}
          {couponError && (
            <span className="font-sans text-[11px] font-medium text-pressed">{couponError}</span>
          )}
        </div>

        <form onSubmit={handleSubmitOrder} className="flex flex-col gap-9">
          <fieldset className="m-0 flex flex-col gap-3.5 border-0 p-0">
            <legend className="mb-1 font-sans text-[10px] uppercase tracking-label-wide text-ink/55">
              DELIVERY ADDRESS
            </legend>

            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                aria-label="Full name"
                className={FIELD}
              />
              <input
                type="tel"
                required
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile number"
                aria-label="Mobile number"
                className={FIELD}
              />
            </div>

            <input
              type="text"
              required
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="Flat / house no., street, area"
              aria-label="Address"
              className={FIELD}
            />

            <div className="grid grid-cols-3 gap-3.5">
              <input
                type="text"
                required
                inputMode="numeric"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                onBlur={handlePincodeBlur}
                placeholder="Pincode"
                aria-label="Pincode"
                className={FIELD}
              />
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                aria-label="City"
                className={FIELD}
              />
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                aria-label="State"
                className={FIELD}
              />
            </div>
          </fieldset>

          <fieldset className="m-0 flex flex-col gap-3.5 border-0 p-0">
            <legend className="mb-1 font-sans text-[10px] uppercase tracking-label-wide text-ink/55">
              PAYMENT
            </legend>

            {PAYMENTS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "flex cursor-pointer items-center justify-between border p-5 transition-colors duration-hover",
                  paymentMethod === option.key
                    ? "border-saffron bg-saffron/10"
                    : "border-ink/25 hover:border-ink/50"
                )}
              >
                <span className="flex flex-col gap-1">
                  <span className="font-sans text-[14px] font-medium">{option.title}</span>
                  {option.note && (
                    <span className="font-sans text-[11px] text-ink/65">{option.note}</span>
                  )}
                </span>
                <input
                  type="radio"
                  name="payment"
                  value={option.key}
                  checked={paymentMethod === option.key}
                  onChange={() => setPaymentMethod(option.key)}
                  className="h-[18px] w-[18px] flex-shrink-0 accent-[var(--color-saffron)]"
                />
              </label>
            ))}
          </fieldset>

          <div className="flex flex-col gap-2.5 border-t border-ink/15 pt-4">
            <Row label="Subtotal">
              <Price amountInPaise={Money.fromPaise(subtotalPaise)} className="font-sans text-[13px]" />
            </Row>

            {discountPaise > 0 && (
              <div className="flex justify-between font-sans text-[13px] font-medium text-peacock">
                <span>Coupon ({appliedCouponName})</span>
                <span>− {Money.formatRupees(Money.fromPaise(discountPaise))}</span>
              </div>
            )}

            <Row label={UI.trust.shipping}>
              <span className="font-sans text-[13px]">{UI.checkout.shippingLabel}</span>
            </Row>

            <ThreadRule />

            <div className="flex items-baseline justify-between">
              <span className="font-display text-[24px] md:text-[26px]">Total</span>
              <Price
                amountInPaise={Money.fromPaise(finalTotalPaise)}
                className="font-display text-[24px] md:text-[26px]"
              />
            </div>
            <p className="m-0 font-sans text-[11px] text-ink/60">{UI.checkout.gstNote}</p>

            {submitError && (
              <p className="m-0 font-sans text-[12px] font-medium text-pressed">{submitError}</p>
            )}

            <Button variant="primary" type="submit" disabled={isSubmitting} fullWidth glint className="mt-2">
              {isSubmitting
                ? "PLACING ORDER…"
                : `${UI.checkout.placeOrder} · ${Money.formatRupees(Money.fromPaise(finalTotalPaise))}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex justify-between font-sans text-[13px] text-ink/75">
    <span>{label}</span>
    {children}
  </div>
);
