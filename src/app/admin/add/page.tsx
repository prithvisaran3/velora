"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/view/primitives/Button";
import { Field } from "@/view/primitives/Field";
import { Swatch } from "@/view/primitives/Swatch";
import { ColourKey, OccasionKey, paise } from "@/model/domain/types";
import { configFixture } from "@/model/fixtures/config.fixture";
import { duplicateLastSaree } from "@/viewmodel/actions/duplicateLastSaree";
import { upsertSaree } from "@/viewmodel/actions/upsertSaree";

export default function AdminAddProductPage() {
  const router = useRouter();
  const [titleEn, setTitleEn] = useState("");
  const [titleTa, setTitleTa] = useState("");
  const [priceInRupees, setPriceInRupees] = useState<number>(3800);
  const [colourKey, setColourKey] = useState<ColourKey>("maroon");
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionKey[]>(["muhurtham"]);
  const [fabric, setFabric] = useState("Pure Mulberry Silk");
  const [lengthCm, setLengthCm] = useState(630);
  const [blousePieceCm, setBlousePieceCm] = useState(80);
  const [zari, setZari] = useState("Half-fine gold zari, 4-inch border");
  const [care, setCare] = useState("Dry clean only");
  const [weightGrams, setWeightGrams] = useState(640);
  const [authenticityNote, setAuthenticityNote] = useState("Handpicked pure silk certified by Bharani Pattu Centre, Erode.");
  const [status, setStatus] = useState<"available" | "draft">("available");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Duplicate last saree feature (20-sec product entry)
  const handleDuplicateLast = async () => {
    const res = await duplicateLastSaree();
    if (res.ok) {
      setFabric(res.data.fabric);
      setLengthCm(res.data.lengthCm);
      setBlousePieceCm(res.data.blousePieceCm);
      setZari(res.data.zari);
      setCare(res.data.care);
      setWeightGrams(res.data.weightGrams);
      setAuthenticityNote(res.data.authenticityNote);
      alert("✓ Copied specs from previous saree! Now enter Title, Price, Colour & Images.");
    }
  };

  const toggleOccasion = (key: OccasionKey) => {
    if (selectedOccasions.includes(key)) {
      if (selectedOccasions.length > 1) {
        setSelectedOccasions(selectedOccasions.filter((o) => o !== key));
      }
    } else {
      setSelectedOccasions([...selectedOccasions, key]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      titleEn,
      titleTa,
      priceInRupees: Number(priceInRupees),
      colourKey,
      occasions: selectedOccasions,
      fabric,
      lengthCm: Number(lengthCm),
      blousePieceCm: Number(blousePieceCm),
      zari,
      care,
      weightGrams: Number(weightGrams),
      images: [
        { id: "/brand/png/icon-flat-512.png", alt: titleEn, aspect: "3/4" as const, order: 1 },
      ],
      authenticityNote,
      status,
    };

    const res = await upsertSaree(payload);
    setIsSubmitting(false);

    if (res.ok) {
      alert("🎉 Saree published successfully to store!");
      router.push("/admin");
    } else {
      alert(`Error: ${res.error.message}`);
    }
  };

  const colours = Object.entries(configFixture.colours) as [
    ColourKey,
    { hex: string; label: { en: string; ta: string } }
  ][];

  const occasions = Object.entries(configFixture.occasions) as [
    OccasionKey,
    { title: { en: string; ta: string } }
  ][];

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6 flex flex-col gap-6 min-h-screen bg-[#FDF4E4]">
      {/* Admin Header */}
      <div className="flex items-center justify-between border-b border-[#241F1C]/15 pb-4">
        <Link href="/admin" className="font-sans text-[12px] uppercase tracking-widest text-[#E8621B]">
          ← Back to Orders
        </Link>
        <span className="font-display text-[20px] text-ink">Add New Saree</span>
      </div>

      {/* Single-tap "Duplicate Last Product" Button */}
      <div className="bg-[#E8621B] text-[#FDF4E4] p-4 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <span className="font-sans text-[12px] font-medium uppercase tracking-wider">
            DUPLICATE LAST PRODUCT
          </span>
          <span className="font-sans text-[10px] opacity-90">
            Copy fabric, zari & care from previous saree
          </span>
        </div>
        <button
          type="button"
          onClick={handleDuplicateLast}
          className="bg-[#FDF4E4] text-[#B4470F] font-sans text-[10px] uppercase tracking-wider px-3 py-2 font-bold"
        >
          DUPLICATE
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Titles & Dynamic Price Input */}
        <div className="flex flex-col gap-3 bg-white p-4 border border-[#241F1C]/15">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#E8621B] font-bold">
            1. TITLE & PRICE / பெயர் மற்றும் விலை
          </span>
          <Field
            label="TITLE (ENGLISH)"
            required
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="e.g. Deep Maroon Mangai Motif Silk Saree"
          />
          <Field
            label="TITLE (TAMIL / தமிழ் பெயர்)"
            required
            value={titleTa}
            onChange={(e) => setTitleTa(e.target.value)}
            placeholder="எ.கா. ஆழ்ந்த அரக்கு மாங்காய் மொடிஃப் பட்டு"
          />
          <Field
            label="PRICE IN RUPEES (₹)"
            type="number"
            required
            value={priceInRupees}
            onChange={(e) => setPriceInRupees(Number(e.target.value))}
            placeholder="e.g. 3800"
          />
        </div>

        {/* Swatch Colour Picker */}
        <div className="flex flex-col gap-3 bg-white p-4 border border-[#241F1C]/15">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#E8621B] font-bold">
            2. COLOUR / நிறம்
          </span>
          <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
            {colours.map(([key, data]) => (
              <Swatch
                key={key}
                colourKey={key}
                hex={data.hex}
                label={data.label.en}
                isSelected={colourKey === key}
                onClick={() => setColourKey(key)}
              />
            ))}
          </div>
        </div>

        {/* Occasion Chips */}
        <div className="flex flex-col gap-3 bg-white p-4 border border-[#241F1C]/15">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#E8621B] font-bold">
            3. OCCASION (MULTI-SELECT)
          </span>
          <div className="flex flex-wrap gap-2">
            {occasions.map(([key, data]) => {
              const isSelected = selectedOccasions.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleOccasion(key)}
                  className={`px-3 py-2 font-sans text-[11px] uppercase tracking-wider border transition-colors ${
                    isSelected ? "bg-[#E8621B] text-[#FDF4E4] border-[#E8621B]" : "border-[#241F1C]/30 text-ink"
                  }`}
                >
                  {data.title.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-col gap-3 bg-white p-4 border border-[#241F1C]/15">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#E8621B] font-bold">
            4. SPECIFICATIONS
          </span>
          <Field label="FABRIC" required value={fabric} onChange={(e) => setFabric(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="LENGTH (CM)" type="number" required value={lengthCm} onChange={(e) => setLengthCm(Number(e.target.value))} />
            <Field label="BLOUSE (CM)" type="number" required value={blousePieceCm} onChange={(e) => setBlousePieceCm(Number(e.target.value))} />
          </div>
          <Field label="ZARI WORK" required value={zari} onChange={(e) => setZari(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="CARE" required value={care} onChange={(e) => setCare(e.target.value)} />
            <Field label="WEIGHT (GRAMS)" type="number" required value={weightGrams} onChange={(e) => setWeightGrams(Number(e.target.value))} />
          </div>
        </div>

        {/* Publish Action */}
        <Button variant="primary" type="submit" disabled={isSubmitting} fullWidth className="h-[56px] text-[13px]">
          {isSubmitting ? "PUBLISHING..." : `PUBLISH SAREE FOR ₹${priceInRupees.toLocaleString("en-IN")}`}
        </Button>
      </form>
    </div>
  );
}
