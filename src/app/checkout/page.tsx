"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/viewmodel/client/useCart";
import { Price } from "@/view/primitives/Price";
import { Button } from "@/view/primitives/Button";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPaise, clearCart } = useCart();

  const [name, setName] = useState("Ananya Sundaram");
  const [phone, setPhone] = useState("9876543210");
  const [addressLine, setAddressLine] = useState("42 Heritage Enclave, Race Course");
  const [pincode, setPincode] = useState("638001");
  const [city, setCity] = useState("Erode");
  const [state, setState] = useState("Tamil Nadu");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod" | "card">("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePincodeBlur = () => {
    if (pincode.startsWith("63") || pincode.startsWith("60") || pincode.startsWith("64")) {
      setCity("Erode");
      setState("Tamil Nadu");
    } else if (pincode.startsWith("56")) {
      setCity("Bengaluru");
      setState("Karnataka");
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      clearCart();
      router.push("/track/VLR-4821");
    }, 900);
  };

  const activeItem = cartItems[0] || {
    id: "vlr-001",
    title: { en: "Zari pallu · Maroon" },
    fabric: "Pure mulberry silk · 6.3 m · blouse attached",
    priceInPaise: 300000,
    images: [{ id: "" }],
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
        <h1 className="font-display text-[46px] text-[#241F1C]">Your bag</h1>

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
              {activeItem.fabric || "Pure mulberry silk · 6.3 m · blouse attached"}
            </span>
            <span className="font-sans text-[11px] tracking-[0.16em] text-[#B4470F] font-medium mt-1">
              HANDPICKED · ONLY ONE IN STOCK
            </span>
          </div>
          <Price amountInPaise={activeItem.priceInPaise as any} className="text-[22px]" />
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
            <span className="font-mono text-[10px] text-[#241F1C]/55">
              PIN lookup fills city + state on blur, fields stay editable
            </span>
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
              <span>₹3,000</span>
            </div>
            <div className="flex justify-between font-sans text-[13px] text-[#241F1C]/75">
              <span>Shipping across India</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between items-baseline mt-[6px]">
              <span className="font-display text-[26px] text-[#241F1C]">Total</span>
              <span className="font-display text-[26px] text-[#241F1C]">₹3,000</span>
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
              {isSubmitting ? "PROCESSING..." : "PLACE ORDER · ₹3,000"}
            </Button>

            <div className="flex justify-between font-sans text-[10px] tracking-[0.18em] uppercase text-[#241F1C]/60 pt-2">
              <span>7-DAY RETURN</span>
              <span>COD AVAILABLE</span>
              <span>GST INVOICE</span>
              <span>DELIVERY 3–6 DAYS</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
