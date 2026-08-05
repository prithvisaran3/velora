"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/view/primitives/Button";
import { Field } from "@/view/primitives/Field";
import { upsertOffer } from "@/viewmodel/actions/upsertOffer";

export default function AdminOffersPage() {
  const [code, setCode] = useState("FESTIVE10");
  const [titleEn, setTitleEn] = useState("Festive 10% Off Curation");
  const [titleTa, setTitleTa] = useState("விழா 10% சிறப்பு சலுகை");
  const [descriptionEn, setDescriptionEn] = useState("Get 10% discount on all handpicked modern silk sarees.");
  const [descriptionTa, setDescriptionTa] = useState("அனைத்து பட்டுப் புடவைகளுக்கும் 10% தள்ளுபடி பெறலாம்.");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed_paise">("percentage");
  const [discountValue, setDiscountValue] = useState(10);
  const [minCartValueInRupees, setMinCartValueInRupees] = useState(3000);
  const [validUntil, setValidUntil] = useState("2026-12-31");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await upsertOffer({
      code: code.toUpperCase(),
      titleEn,
      titleTa,
      descriptionEn,
      descriptionTa,
      discountType,
      discountValue: Number(discountValue),
      minCartValueInRupees: Number(minCartValueInRupees),
      validFrom: new Date().toISOString(),
      validUntil: `${validUntil}T23:59:59Z`,
      isActive: true,
    });

    setIsSubmitting(false);

    if (res.ok) {
      alert(`🎉 Offer Coupon ${code} created successfully! Customers can now use it on the website.`);
    } else {
      alert(`Error: ${res.error.message}`);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6 flex flex-col gap-6 min-h-screen bg-cream">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ink/15 pb-4">
        <Link href="/admin" className="font-sans text-[12px] uppercase tracking-widest text-saffron">
          ← Back to Orders
        </Link>
        <span className="font-display text-[20px] text-ink">Create Offer / Coupon</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-panel p-4 border border-ink/15 flex flex-col gap-3">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-saffron font-bold">
            1. PROMO CODE / கூப்பன் குறியீடு
          </span>
          <Field
            label="COUPON CODE (UPPERCASE)"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. FESTIVE10 or WELCOME500"
          />
        </div>

        <div className="bg-panel p-4 border border-ink/15 flex flex-col gap-3">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-saffron font-bold">
            2. OFFER TITLE / தலைப்பு
          </span>
          <Field label="TITLE (ENGLISH)" required value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          <Field label="TITLE (TAMIL / தமிழ்)" required value={titleTa} onChange={(e) => setTitleTa(e.target.value)} />
        </div>

        <div className="bg-panel p-4 border border-ink/15 flex flex-col gap-3">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-saffron font-bold">
            3. DISCOUNT VALUE / தள்ளுபடி விவரம்
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDiscountType("percentage")}
              className={`flex-1 py-3 font-sans text-[11px] uppercase tracking-wider border ${
                discountType === "percentage" ? "bg-saffron text-panel border-saffron" : "border-ink/30 text-ink hover:border-saffron"
              }`}
            >
              Percentage (%)
            </button>
            <button
              type="button"
              onClick={() => setDiscountType("fixed_paise")}
              className={`flex-1 py-3 font-sans text-[11px] uppercase tracking-wider border ${
                discountType === "fixed_paise" ? "bg-saffron text-panel border-saffron" : "border-ink/30 text-ink hover:border-saffron"
              }`}
            >
              Flat Amount (₹)
            </button>
          </div>

          <Field
            label={discountType === "percentage" ? "DISCOUNT PERCENTAGE (%)" : "FLAT RUPEE DISCOUNT (₹)"}
            type="number"
            required
            value={discountValue}
            onChange={(e) => setDiscountValue(Number(e.target.value))}
          />

          <Field
            label="MINIMUM ORDER VALUE (₹)"
            type="number"
            value={minCartValueInRupees}
            onChange={(e) => setMinCartValueInRupees(Number(e.target.value))}
          />

          <Field
            label="EXPIRY DATE"
            type="date"
            required
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </div>

        <Button variant="primary" type="submit" disabled={isSubmitting} fullWidth className="h-[52px] text-[12px]">
          {isSubmitting ? "CREATING..." : "ACTIVATE OFFER ON STOREFRONT"}
        </Button>
      </form>
    </div>
  );
}
