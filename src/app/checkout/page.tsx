"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/viewmodel/client/useCart";
import { useAuth } from "@/viewmodel/client/useAuth";
import { Price } from "@/view/primitives/Price";
import { Button } from "@/view/primitives/Button";
import { applyCoupon } from "@/viewmodel/actions/applyCoupon";
import { recordPayment } from "@/viewmodel/actions/recordPayment";
import { paise } from "@/model/domain/types";
import { Wordmark } from "@/view/primitives/Wordmark";
import { UI } from "@/content/ui";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { user, signInWithGoogle } = useAuth();

  const [name, setName] = useState("Ananya Sundaram");
  const [phone, setPhone] = useState("9876543210");
  const [addressLine, setAddressLine] = useState("42 Heritage Enclave, Race Course");
  const [pincode, setPincode] = useState("638001");
  const [city, setCity] = useState("Erode");
  const [state, setState] = useState("Tamil Nadu");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod" | "card">("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [discountPaise, setDiscountPaise] = useState(0);
  const [appliedCouponName, setAppliedCouponName] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Pre-fill user details when signed in via Google
  useEffect(() => {
    if (user) {
      if (user.displayName) setName(user.displayName);
    }
  }, [user]);

  const activeItem = cartItems[0] || {
    id: "vlr-001",
    title: { en: "Deep Maroon Mangai Motif Silk Saree" },
    fabric: "Pure Kanchipuram Mulberry Silk · 6.3 m · blouse attached",
    priceInPaise: 385000,
    images: [{ id: "" }],
  };

  const itemPricePaise = activeItem.priceInPaise;
  const finalTotalPaise = Math.max(0, itemPricePaise - discountPaise);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponCode.trim()) return;

    const res = await applyCoupon(couponCode, itemPricePaise);
    if (res.ok) {
      setDiscountPaise(res.data.discountInPaise);
      setAppliedCouponName(res.data.code);
      setCouponSuccess(`✓ Coupon ${res.data.code} applied! Saved ₹${Math.round(res.data.discountInPaise / 100)}.`);
    } else {
      setCouponError(res.error.message);
    }
  };

  const handlePincodeBlur = () => {
    if (pincode.startsWith("63") || pincode.startsWith("60") || pincode.startsWith("64")) {
      setCity("Erode");
      setState("Tamil Nadu");
    } else if (pincode.startsWith("56")) {
      setCity("Bengaluru");
      setState("Karnataka");
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ref = `VLR-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const { db } = await import("@/infrastructure/firebase/client");
      const { collection, addDoc } = await import("firebase/firestore");
      
      const newOrder = {
        reference: ref,
        status: paymentMethod === "cod" ? "pending" : "paid",
        items: [{
          sareeId: activeItem.id,
          title: activeItem.title,
          priceInPaise: activeItem.priceInPaise,
          imageId: activeItem.images[0]?.id || "",
        }],
        totals: {
          subtotalInPaise: itemPricePaise,
          shippingInPaise: 0,
          totalInPaise: finalTotalPaise,
        },
        customer: { name, phone },
        address: { line1: addressLine, city, state, pincode },
        payment: { method: paymentMethod },
        timeline: [
          { status: "pending", at: new Date().toISOString(), note: `Order placed via ${paymentMethod.toUpperCase()}` },
          ...(paymentMethod !== "cod" ? [{ status: "paid", at: new Date().toISOString(), note: `Payment captured` }] : [])
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "orders"), newOrder);

      setTimeout(() => {
        clearCart();
        router.push(`/track/${ref}`);
      }, 900);
    } catch (e) {
      console.error("Failed to save order", e);
      setIsSubmitting(false);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="w-full bg-cream min-h-screen flex flex-col items-center">
      {/* D6 Header: Centered Logo Only */}
      <div className="w-full py-6 flex flex-col items-center justify-center border-b border-ink/12">
        <Link href="/" className="group">
          <Wordmark fontSize={28} tone="ink" endorsement />
        </Link>
      </div>

      {/* D6 Single 720px Column */}
      <div className="w-full max-w-[720px] px-6 py-[56px] pb-[72px] flex flex-col gap-[36px]">
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-[46px] text-ink">Your bag</h1>
          <span className="font-sans text-[11px] tracking-label uppercase text-ink/60">
            GUEST CHECKOUT SUPPORTED
          </span>
        </div>

        {/* Optional Google Sign-In Banner */}
        {!user ? (
          <div className="bg-sand p-4 border border-ink/15 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-sans text-[12px] font-medium text-ink">Have a Google Account?</span>
              <span className="font-sans text-[10px] opacity-75">Sign in to auto-fill name & delivery details</span>
            </div>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="bg-white text-ink border border-ink/25 px-4 py-2 font-sans text-[10px] uppercase tracking-wider font-bold hover:border-saffron"
            >
              SIGN IN WITH GOOGLE
            </button>
          </div>
        ) : (
          <div className="bg-peacock text-cream p-3 px-4 flex items-center justify-between">
            <span className="font-sans text-[12px]">✓ Signed in as <strong>{user.displayName}</strong></span>
            <span className="font-sans text-[9px] uppercase tracking-widest opacity-80">EXPRESS CHECKOUT</span>
          </div>
        )}

        {/* Item Line */}
        <div className="flex gap-5 pb-[24px] border-b border-ink/15">
          <div className="w-[110px] h-[146px] placeholder-weave flex-shrink-0 border border-ink/10 relative overflow-hidden">
            {activeItem.images[0]?.id && !activeItem.images[0].id.includes("icon-flat") && (
              <Image src={activeItem.images[0].id} alt={activeItem.title.en} fill className="object-cover" />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="font-display text-[22px] text-ink">{activeItem.title.en}</h3>
            <span className="font-sans text-[11px] tracking-[0.1em] text-ink/65">
              {activeItem.fabric || "Pure Kanchipuram Mulberry Silk · 6.3 m · blouse attached"}
            </span>
            <span className="font-sans text-[11px] tracking-label text-pressed font-medium mt-1 uppercase">
              HANDPICKED · ONLY ONE IN STOCK
            </span>
          </div>
          <Price amountInPaise={itemPricePaise as any} className="text-[22px]" />
        </div>

        {/* Coupon Code Promo Box */}
        <div className="bg-white p-5 border border-ink/15 flex flex-col gap-3">
          <span className="font-sans text-[10px] tracking-label-wide uppercase text-saffron font-bold">
            PROMO CODE / தள்ளுபடி கூப்பன்
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. FESTIVE500 or WELCOME10"
              className="flex-1 border border-ink/30 p-3 font-mono text-[13px] text-ink bg-transparent focus:outline-none focus:border-saffron"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-ink text-cream px-5 font-sans text-[10px] tracking-label uppercase font-bold hover:bg-ink/90 transition-colors"
            >
              APPLY
            </button>
          </div>
          {couponSuccess && <span className="font-sans text-[11px] text-peacock font-medium">{couponSuccess}</span>}
          {couponError && <span className="font-sans text-[11px] text-pressed font-medium">{couponError}</span>}
        </div>

        <form onSubmit={handleSubmitOrder} className="flex flex-col gap-[36px]">
          {/* Address Block */}
          <div className="flex flex-col gap-[14px]">
            <span className="font-sans text-[11px] tracking-label-wide uppercase text-ink/55">
              DELIVERY ADDRESS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-ink/30 p-[15px] px-[16px] font-sans text-[13px] text-ink bg-transparent focus:outline-none focus:border-saffron"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile number"
                className="w-full border border-ink/30 p-[15px] px-[16px] font-sans text-[13px] text-ink bg-transparent focus:outline-none focus:border-saffron"
              />
            </div>

            <input
              type="text"
              required
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="Flat / house no., street, area"
              className="w-full border border-ink/30 p-[15px] px-[16px] font-sans text-[13px] text-ink bg-transparent focus:outline-none focus:border-saffron"
            />

            <div className="grid grid-cols-3 gap-[14px]">
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                onBlur={handlePincodeBlur}
                placeholder="638001"
                className="w-full border border-ink/30 focus:border-saffron p-[15px] px-[16px] font-sans text-[13px] text-ink bg-transparent focus:outline-none"
              />
              <input
                type="text"
                readOnly
                value={city}
                className="w-full bg-sand border border-ink/15 p-[15px] px-[16px] font-sans text-[13px] text-ink/70 focus:outline-none"
              />
              <input
                type="text"
                readOnly
                value={state}
                className="w-full bg-sand border border-ink/15 p-[15px] px-[16px] font-sans text-[13px] text-ink/70 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Block — UPI FIRST */}
          <div className="flex flex-col gap-[14px]">
            <span className="font-sans text-[11px] tracking-label-wide uppercase text-ink/55">
              PAYMENT
            </span>

            {/* UPI Option */}
            <div
              onClick={() => setPaymentMethod("upi")}
              className={`p-[20px] border flex justify-between items-center cursor-pointer transition-colors ${
                paymentMethod === "upi" ? "border-saffron bg-saffron/10" : "border-ink/25 hover:border-ink/50"
              }`}
            >
              <div className="flex flex-col gap-[5px]">
                <span className="font-sans text-[14px] text-ink font-medium">
                  UPI — GPay, PhonePe, Paytm
                </span>
                <span className="font-sans text-[11px] text-ink/65">
                  Most Velora orders are paid this way
                </span>
              </div>
              <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors ${paymentMethod === "upi" ? "bg-saffron" : "border border-ink/35"}`}>
                {paymentMethod === "upi" && <div className="w-2 h-2 rounded-full bg-cream" />}
              </div>
            </div>

            {/* COD Option */}
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`p-[20px] border flex justify-between items-center cursor-pointer transition-colors ${
                paymentMethod === "cod" ? "border-saffron bg-saffron/10" : "border-ink/25 hover:border-ink/50"
              }`}
            >
              <span className="font-sans text-[14px] text-ink">Cash on delivery</span>
              <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors ${paymentMethod === "cod" ? "bg-saffron" : "border border-ink/35"}`}>
                {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-cream" />}
              </div>
            </div>

            {/* Card Option */}
            <div
              onClick={() => setPaymentMethod("card")}
              className={`p-[20px] border flex justify-between items-center cursor-pointer transition-colors ${
                paymentMethod === "card" ? "border-saffron bg-saffron/10" : "border-ink/25 hover:border-ink/50"
              }`}
            >
              <span className="font-sans text-[14px] text-ink">Card / Netbanking</span>
              <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors ${paymentMethod === "card" ? "bg-saffron" : "border border-ink/35"}`}>
                {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-cream" />}
              </div>
            </div>
          </div>

          {/* Totals & Submit */}
          <div className="flex flex-col gap-[10px] pt-[8px] border-t border-ink/15">
            <div className="flex justify-between font-sans text-[13px] text-ink/75">
              <span>Subtotal</span>
              <Price amountInPaise={itemPricePaise as any} />
            </div>

            {discountPaise > 0 && (
              <div className="flex justify-between font-sans text-[13px] text-peacock font-medium">
                <span>Coupon ({appliedCouponName})</span>
                <span>- ₹{Math.round(discountPaise / 100).toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between font-sans text-[13px] text-ink/75">
              <span>Shipping across India</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between items-baseline mt-[6px]">
              <span className="font-display text-[26px] text-ink">Total</span>
              <Price amountInPaise={finalTotalPaise as any} className="text-[26px]" />
            </div>
            <span className="font-sans text-[11px] text-ink/60">
              Inclusive of GST. Invoice emailed on dispatch.
            </span>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="py-[22px] text-[12px] tracking-label mt-2"
              fullWidth
            >
              {isSubmitting ? "PROCESSING..." : `PLACE ORDER · ₹${(finalTotalPaise / 100).toLocaleString("en-IN")}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
