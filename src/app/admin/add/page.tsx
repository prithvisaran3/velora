"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/view/primitives/Button";
import { Field } from "@/view/primitives/Field";
import { Swatch } from "@/view/primitives/Swatch";
import { ColourKey, OccasionKey } from "@/model/domain/types";
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
  const [authenticityNote, setAuthenticityNote] = useState("Handpicked pure silk, chosen in Erode by Priya Mahadevan.");
  const [status, setStatus] = useState<"available" | "draft">("available");
  
  // Product Photos state
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [pastedUrl, setPastedUrl] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
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
      alert("✓ Copied specs from previous saree! Now enter Title, Price, Colour & Photos.");
    }
  };

  // Image Upload with Client Compression to Firebase Storage
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const newUrls: string[] = [];

    // Dynamically import Firebase to keep initial bundle small
    const { storage } = await import("@/infrastructure/firebase/client");
    const { ref, uploadString, getDownloadURL } = await import("firebase/storage");

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = (event) => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxDim = 2000;
            let width = img.width;
            let height = img.height;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });

      try {
        const fileRef = ref(storage, `sarees/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, "_")}.jpg`);
        await uploadString(fileRef, dataUrl, "data_url");
        const downloadUrl = await getDownloadURL(fileRef);
        newUrls.push(downloadUrl);
      } catch (error) {
        console.error("Failed to upload image to Firebase Storage:", error);
      }
    }

    setImageUrls((prev) => [...prev, ...newUrls]);
    setIsCompressing(false);
  };

  const handleAddPastedUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedUrl.trim()) return;
    setImageUrls((prev) => [...prev, pastedUrl.trim()]);
    setPastedUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
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

    const finalImages = imageUrls.length > 0
      ? imageUrls.map((url, idx) => ({
          id: url,
          alt: `${titleEn} view ${idx + 1}`,
          aspect: "3/4" as const,
          order: idx + 1,
        }))
      : [
          { id: "/brand/png/icon-flat-512.png", alt: titleEn, aspect: "3/4" as const, order: 1 },
        ];

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
      images: finalImages,
      authenticityNote,
      status,
    };

    const res = await upsertSaree(payload);
    setIsSubmitting(false);

    if (res.ok) {
      alert("🎉 Saree and Photos published successfully to storefront!");
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
    <div className="max-w-[600px] mx-auto px-4 py-6 flex flex-col gap-6 min-h-screen bg-cream">
      {/* Admin Header */}
      <div className="flex items-center justify-between border-b border-ink/15 pb-4">
        <Link href="/admin" className="font-sans text-[12px] uppercase tracking-widest text-saffron">
          ← Back to Orders
        </Link>
        <span className="font-display text-[20px] text-ink">Add New Saree</span>
      </div>

      {/* Single-tap "Duplicate Last Product" Button */}
      <div className="bg-saffron text-cream p-4 flex items-center justify-between shadow-none">
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
          className="bg-cream text-pressed font-sans text-[10px] uppercase tracking-wider px-3 py-2 font-bold hover:bg-cream/90"
        >
          DUPLICATE
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Titles & Dynamic Price Input */}
        <div className="flex flex-col gap-3 bg-white p-4 border border-ink/15">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-saffron font-bold">
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
        <div className="flex flex-col gap-3 bg-white p-4 border border-ink/15">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-saffron font-bold">
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
        <div className="flex flex-col gap-3 bg-white p-4 border border-ink/15">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-saffron font-bold">
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
                    isSelected ? "bg-saffron text-cream border-saffron" : "border-ink/30 text-ink"
                  }`}
                >
                  {data.title.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-col gap-3 bg-white p-4 border border-ink/15">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-saffron font-bold">
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

        {/* Section 5: PRODUCT PHOTOS / புகைப்படங்கள் */}
        <div className="flex flex-col gap-4 bg-white p-4 border border-ink/15">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-saffron font-bold">
              5. PRODUCT PHOTOS / புகைப்படங்கள் ({imageUrls.length})
            </span>
            {isCompressing && <span className="font-sans text-[10px] text-pressed animate-pulse">Compressing photos...</span>}
          </div>

          {/* Mobile Camera / Multi-Upload File Input */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-saffron/40 hover:border-saffron bg-saffron/10 p-6 text-center cursor-pointer transition-colors">
            <span className="font-sans text-[13px] font-bold text-saffron">
              📸 TAKE PHOTO OR SELECT IMAGES
            </span>
            <span className="font-sans text-[10px] text-ink/65 mt-1">
              Select multiple photos from camera or gallery (JPEG/PNG)
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Paste Image URL Fallback */}
          <div className="flex gap-2 pt-1 border-t border-ink/10">
            <input
              type="url"
              value={pastedUrl}
              onChange={(e) => setPastedUrl(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className="flex-1 border border-ink/25 p-2 font-sans text-[11px] bg-transparent focus:outline-none focus:border-saffron"
            />
            <button
              type="button"
              onClick={handleAddPastedUrl}
              className="bg-ink text-cream px-4 font-sans text-[10px] uppercase tracking-wider hover:bg-ink/90 transition-colors"
            >
              ADD URL
            </button>
          </div>

          {/* Live Thumbnail Grid Preview */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-[3/4] border border-ink/20 bg-cream overflow-hidden group">
                  <Image src={url} alt={`Upload preview ${idx + 1}`} fill className="object-cover" />
                  
                  {/* Photo Order Badge */}
                  <div className="absolute top-1.5 left-1.5 bg-ink/85 text-cream text-[9px] font-sans px-1.5 py-0.5 tracking-wider uppercase">
                    {idx === 0 ? "1. FLAT-LAY / MAIN" : idx === 1 ? "2. DRAPED VIEW" : `${idx + 1}. DETAIL`}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 bg-pressed text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shadow-none hover:scale-110 transition-transform"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publish Action */}
        <Button variant="primary" type="submit" disabled={isSubmitting || isCompressing} fullWidth className="h-[56px] text-[13px]">
          {isSubmitting ? "PUBLISHING..." : `PUBLISH SAREE FOR ₹${priceInRupees.toLocaleString("en-IN")}`}
        </Button>
      </form>
    </div>
  );
}
