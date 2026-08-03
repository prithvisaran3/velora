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

    await recordPayment({
      orderId: `ord-${Date.now()}`,
      orderReference: ref,
      amountInRupees: finalTotalPaise / 100,
      method: paymentMethod,
      status: paymentMethod === "cod" ? "initiated" : "captured",
      gatewayProvider: paymentMethod === "cod" ? "cod" : "razorpay",
      gatewayPaymentId: paymentMethod === "cod" ? undefined : `pay_rzp_${Date.now()}`,
      customerPhone: phone,
    });

    setTimeout(() => {
      clearCart();
      router.push(`/track/${ref}`);
    }, 900);
  };

  return (
    <div className="w-full bg-[#FDF4E4] min-h-screen flex flex-col items-center">
      {/* D6 Header: Centered Logo Only */}
      <div className="w-full py-6 flex flex-col items-center justify-center border-b border-[#241F1C]/12">
        <Link href="/" className="flex flex-col items-center group text-center">
          <div className="flex items-end justify-center">
            <svg viewBox="0 0 100 124" className="w-[19px] h-[24px] mr-2">
              <path d="M6 8 C 21 30 39 68 50 116 C 61 68 79 30 94 8 L 77 8 C 67 28 56 58 50 84 C 44 58 33 28 23 8 Z" fill="#E8621B" />
              <path d="M50 12 L55 19 L50 78 L45 19 Z" fill="#F5A623" />
              <path d="M37 91 L63 91 L63 98 L37 98 Z" fill="#F5A623" />
            </svg>
            <span className="font-display text-[28px] leading-[0.82] tracking-[0.28em] text-[#241F1C] mr-[-0.28em]">
              ELORA
            </span>
          </div>
          <span className="font-sans text-[7px] tracking-[0.34em] uppercase text-[#241F1C]/65 mr-[-0.34em] mt-[5px]">
            BY BHARANI PATTU
          </span>
        </Link>
      </div>

      {/* D6 Single 720px Column */}
      <div className="w-full max-w-[720px] px-6 py-[56px] pb-[72px] flex flex-col gap-[36px]">
        <div className="flex items-baseline justify-between">
          <h1 className="font-display text-[46px] text-[#241F1C]">Your bag</h1>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#241F1C]/60">
            GUEST CHECKOUT SUPPORTED
          </span>
        </div>

        {/* Optional Google Sign-In Banner */}
        {!user ? (
          <div className="bg-[#F6EAD6] p-4 border border-[#241F1C]/15 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-sans text-[12px] font-medium text-ink">Have a Google Account?</span>
              <span className="font-sans text-[10px] opacity-75">Sign in to auto-fill name & delivery details</span>
            </div>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="bg-white text-ink border border-[#241F1C]/25 px-4 py-2 font-sans text-[10px] uppercase tracking-wider font-bold hover:border-[#E8621B]"
            >
              SIGN IN WITH GOOGLE
            </button>
          </div>
        ) : (
          <div className="bg-[#12514E] text-[#FDF4E4] p-3 px-4 flex items-center justify-between">
            <span className="font-sans text-[12px]">✓ Signed in as <strong>{user.displayName}</strong></span>
            <span className="font-sans text-[9px] uppercase tracking-widest opacity-80">EXPRESS CHECKOUT</span>
          </div>
        )}

        {/* Item Line */}
        <div className="flex gap-5 pb-[24px] border-b border-[#241F1C]/15">
          <div className="w-[110px] h-[146px] placeholder-weave flex-shrink-0 border border-[#241F1C]/10 relative overflow-hidden">
            {activeItem.images[0]?.id && !activeItem.images[0].id.includes("icon-flat") && (
              <Image src={activeItem.images[0].id} alt={activeItem.title.en} fill className="object-cover" />
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="font-display text-[22px] text-[#241F1C]">{activeItem.title.en}</h3>
            <span className="font-sans text-[11px] tracking-[0.1em] text-[#241F1C]/65">
              {activeItem.fabric || "Pure Kanchipuram Mulberry Silk · 6.3 m · blouse attached"}
            </span>
            <span className="font-sans text-[11px] tracking-[0.16em] text-[#B4470F] font-medium mt-1">
              HANDPICKED · ONLY ONE IN STOCK
            </span>
          </div>
          <Price amountInPaise={itemPricePaise as any} className="text-[22px]" />
        </div>

        {/* Coupon Code Promo Box */}
        <div className="bg-white p-5 border border-[#241F1C]/15 flex flex-col gap-3">
          <span className="font-sans text-[10px] tracking-[0.26em] uppercase text-[#E8621B] font-bold">
            PROMO CODE / தள்ளுபடி கூப்பன்
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. FESTIVE500 or WELCOME10"
              className="flex-1 border border-[#241F1C]/30 p-3 font-mono text-[13px] text-[#241F1C] bg-transparent focus:outline-none focus:border-[#E8621B]"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-[#241F1C] text-[#FDF4E4] px-5 font-sans text-[10px] tracking-[0.2em] uppercase font-bold"
            >
              APPLY
            </button>
          </div>
          {couponSuccess && <span className="font-sans text-[11px] text-[#12514E] font-medium">{couponSuccess}</span>}
          {couponError && <span className="font-sans text-[11px] text-[#B4470F] font-medium">{couponError}</span>}
        </div>

        <form onSubmit={handleSubmitOrder} className="flex flex-col gap-[36px]">
          {/* Address Block */}
          <div className="flex flex-col gap-[14px]">
            <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#241F1C]/55">
              DELIVERY ADDRESS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-[#241F1C]/30 p-[15px] px-[16px] font-sans text-[13px] text-[#241F1C] bg-transparent focus:outline-none focus:border-[#E8621B]"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile number"
                className="w-full border border-[#241F1C]/30 p-[15px] px-[16px] font-sans text-[13px] text-[#241F1C] bg-transparent focus:outline-none focus:border-[#E8621B]"
              />
            </div>

            <input
              type="text"
              required
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="Flat / house no., street, area"
              className="w-full border border-[#241F1C]/30 p-[15px] px-[16px] font-sans text-[13px] text-[#241F1C] bg-transparent focus:outline-none focus:border-[#E8621B]"
            />

            <div className="grid grid-cols-3 gap-[14px]">
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                onBlur={handlePincodeBlur}
                placeholder="638001"
                className="w-full border border-[#E8621B] p-[15px] px-[16px] font-sans text-[13px] text-[#241F1C] bg-transparent focus:outline-none"
              />
              <input
                type="text"
                readOnly
                value={city}
                className="w-full bg-[#F6EAD6] border border-[#241F1C]/15 p-[15px] px-[16px] font-sans text-[13px] text-[#241F1C]/70 focus:outline-none"
              />
              <input
                type="text"
                readOnly
                value={state}
                className="w-full bg-[#F6EAD6] border border-[#241F1C]/15 p-[15px] px-[16px] font-sans text-[13px] text-[#241F1C]/70 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Block — UPI FIRST */}
          <div className="flex flex-col gap-[14px]">
            <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#241F1C]/55">
              PAYMENT
            </span>

            {/* UPI Option */}
            <div
              onClick={() => setPaymentMethod("upi")}
              className={`p-[20px] border flex justify-between items-center cursor-pointer transition-colors ${
                paymentMethod === "upi" ? "border-[#E8621B] bg-[#FBEEDF]" : "border-[#241F1C]/25"
              }`}
            >
              <div className="flex flex-col gap-[5px]">
                <span className="font-sans text-[14px] text-[#241F1C] font-medium">
                  UPI — GPay, PhonePe, Paytm
                </span>
                <span className="font-sans text-[11px] text-[#241F1C]/65">
                  Most Velora orders are paid this way
                </span>
              </div>
              <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center ${paymentMethod === "upi" ? "bg-[#E8621B]" : "border border-[#241F1C]/35"}`}>
                {paymentMethod === "upi" && <div className="w-2 h-2 rounded-full bg-[#FDF4E4]" />}
              </div>
            </div>

            {/* COD Option */}
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`p-[20px] border flex justify-between items-center cursor-pointer transition-colors ${
                paymentMethod === "cod" ? "border-[#E8621B] bg-[#FBEEDF]" : "border-[#241F1C]/25"
              }`}
            >
              <span className="font-sans text-[14px] text-[#241F1C]">Cash on delivery</span>
              <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center ${paymentMethod === "cod" ? "bg-[#E8621B]" : "border border-[#241F1C]/35"}`}>
                {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-[#FDF4E4]" />}
              </div>
            </div>

            {/* Card Option */}
            <div
              onClick={() => setPaymentMethod("card")}
              className={`p-[20px] border flex justify-between items-center cursor-pointer transition-colors ${
                paymentMethod === "card" ? "border-[#E8621B] bg-[#FBEEDF]" : "border-[#241F1C]/25"
              }`}
            >
              <span className="font-sans text-[14px] text-[#241F1C]">Card / Netbanking</span>
              <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center ${paymentMethod === "card" ? "bg-[#E8621B]" : "border border-[#241F1C]/35"}`}>
                {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-[#FDF4E4]" />}
              </div>
            </div>
          </div>

          {/* Totals & Submit */}
          <div className="flex flex-col gap-[10px] pt-[8px] border-t border-[#241F1C]/15">
            <div className="flex justify-between font-sans text-[13px] text-[#241F1C]/75">
              <span>Subtotal</span>
              <Price amountInPaise={itemPricePaise as any} />
            </div>

            {discountPaise > 0 && (
              <div className="flex justify-between font-sans text-[13px] text-[#12514E] font-medium">
                <span>Coupon ({appliedCouponName})</span>
                <span>- ₹{Math.round(discountPaise / 100).toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between font-sans text-[13px] text-[#241F1C]/75">
              <span>Shipping across India</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between items-baseline mt-[6px]">
              <span className="font-display text-[26px] text-[#241F1C]">Total</span>
              <Price amountInPaise={finalTotalPaise as any} className="text-[26px]" />
            </div>
            <span className="font-sans text-[11px] text-[#241F1C]/60">
              Inclusive of GST. Invoice emailed on dispatch.
            </span>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="py-[22px] text-[12px] tracking-[0.24em] mt-2"
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
