"use client";

import React, { use, useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { getProductViewModel } from "@/viewmodel/server/product.viewmodel";
import { useCart } from "@/viewmodel/client/useCart";
import { useBagFlight } from "@/viewmodel/client/useBagFlight";
import { Loupe } from "@/view/components/Loupe";
import { Price } from "@/view/primitives/Price";
import { Button } from "@/view/primitives/Button";
import { SareeCard } from "@/view/components/SareeCard";
import { DrapeViewer } from "@/view/components/DrapeViewer";
import { StickyBuyBar } from "@/view/layout/StickyBuyBar";
import { WhatsAppFab } from "@/view/layout/WhatsAppFab";

interface PDPPageProps {
  params: Promise<{ slug: string }>;
}

export default function PDPPage({ params }: PDPPageProps) {
  const resolvedParams = use(params);
  const [vm, setVm] = useState<any>(null);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const { addToCart, cartItems } = useCart();
  const flyToBag = useBagFlight();
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProductViewModel(resolvedParams.slug).then(setVm);
  }, [resolvedParams.slug]);

  // The bag is updated first; the flight is decoration on top of a done deal.
  const handleAddToBag = useCallback(() => {
    if (!vm) return;
    addToCart(vm.saree);
    flyToBag(mediaRef.current, vm.saree.colour.hex);
  }, [vm, addToCart, flyToBag]);

  if (!vm) {
    return <div className="min-h-screen py-24 text-center font-display text-[20px]">Loading saree details...</div>;
  }

  const { saree, relatedSarees } = vm;
  const isSoldOut = saree.status === "sold";
  const isAddedToCart = cartItems.some((item: any) => item.id === saree.id);

  const mainImg = saree.images[selectedImgIdx]?.id || saree.images[0]?.id;
  const isRealMainImg = !!mainImg && !mainImg.includes("icon-flat");
  const isBase64 = mainImg?.startsWith("data:");

  return (
    <div className="w-full bg-cream">
      <div className="max-w-[1440px] mx-auto border-b border-ink/15">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* D4 Left 840px Media Column */}
          <div className="w-full md:w-[840px] flex flex-col border-r border-ink/12 flex-shrink-0">
            <div
              ref={mediaRef}
              className="relative h-[500px] md:h-[700px] bg-sand border-b border-ink/10 flex items-center justify-center overflow-hidden"
            >
              {isRealMainImg ? (
                <Loupe src={mainImg} alt={saree.title.en} className="w-full h-full" />
              ) : (
                <div
                  className="w-full h-full flex flex-col justify-between p-8"
                  style={{
                    background: `linear-gradient(135deg, ${saree.colour.hex || "var(--color-saree-maroon)"} 0%, var(--color-ink) 100%)`,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-display text-[22px] text-cream tracking-[0.28em]">VELORA</span>
                    <span className="font-sans text-[11px] text-marigold tracking-label uppercase">PURE SILK</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-display text-[34px] text-cream">{saree.title.en}</h2>
                    <span className="font-sans text-[12px] text-marigold tracking-label uppercase">{saree.fabric}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Image Thumbnails */}
            {saree.images.length > 1 && (
              <div className="grid grid-cols-3 gap-[2px] bg-ink/10">
                {saree.images.slice(0, 3).map((img: any, idx: number) => {
                  const isSelected = idx === selectedImgIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`relative h-[140px] md:h-[180px] bg-sand overflow-hidden border-2 transition-all ${
                        isSelected ? "border-saffron" : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      {img.id && !img.id.includes("icon-flat") ? (
                        <Image src={img.id} alt={img.alt || `View ${idx + 1}`} fill unoptimized={img.id.startsWith("data:")} className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-2 text-center font-sans text-[10px] text-ink/60">
                          VIEW {idx + 1}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* D4 · walk around the drape (loads on intersection) */}
            <DrapeViewer hex={saree.colour.hex} title={saree.title.en} />
          </div>

          {/* D4 Right Detail Column */}
          <div className="flex-1 p-8 md:p-[56px] flex flex-col gap-[26px]">
            <div className="flex flex-col gap-3">
              <span className="font-sans text-[11px] tracking-label-wide uppercase text-pressed font-medium">
                HANDPICKED · ERODE SILK EDIT
              </span>
              <h1 className="font-display text-[36px] md:text-[52px] leading-[1.04] text-ink">
                {saree.title.en}
              </h1>
              <div className="font-tamil text-[17px] text-ink/75">
                {saree.title.ta}
              </div>
            </div>

            <div className="flex items-baseline gap-4 py-2 border-t border-b border-ink/15">
              <Price amountInPaise={saree.priceInPaise} className="text-[32px] md:text-[38px]" />
              <span className="font-sans text-[11px] tracking-[0.16em] uppercase text-ink/60">
                INCL. GST · FREE SHIPPING
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant={isSoldOut ? "disabled" : "primary"}
                onClick={handleAddToBag}
                disabled={isSoldOut}
                className="py-5 text-[12px] tracking-label"
                fullWidth
              >
                {isSoldOut ? "SOLD OUT" : isAddedToCart ? "ADDED TO BAG ✓" : "ADD TO BAG"}
              </Button>

              <a
                href={`https://wa.me/919876543210?text=I'm%20interested%20in%20${encodeURIComponent(saree.title.en)}%20(${saree.slug})`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary" className="py-[19px] text-[12px] tracking-label" fullWidth>
                  ASK ON WHATSAPP
                </Button>
              </a>
            </div>

            {/* Spec Table */}
            <div className="flex flex-col border-t border-b border-ink/15 py-1 text-[12px] font-sans">
              <div className="flex justify-between py-3 border-b border-ink/10">
                <span className="tracking-[0.16em] uppercase text-ink/55">FABRIC</span>
                <span className="text-ink">{saree.fabric}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-ink/10">
                <span className="tracking-[0.16em] uppercase text-ink/55">LENGTH</span>
                <span className="text-ink">{(saree.lengthCm / 100).toFixed(1)} m incl. blouse</span>
              </div>
              <div className="flex justify-between py-3 border-b border-ink/10">
                <span className="tracking-[0.16em] uppercase text-ink/55">BLOUSE PIECE</span>
                <span className="text-ink">{(saree.blousePieceCm / 100).toFixed(1)} m, attached</span>
              </div>
              <div className="flex justify-between py-3 border-b border-ink/10">
                <span className="tracking-[0.16em] uppercase text-ink/55">ZARI</span>
                <span className="text-ink">{saree.zari}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-ink/10">
                <span className="tracking-[0.16em] uppercase text-ink/55">CARE</span>
                <span className="text-ink">{saree.care}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="tracking-[0.16em] uppercase text-ink/55">WEIGHT</span>
                <span className="text-ink">{saree.weightGrams} g</span>
              </div>
            </div>

            {/* D4 Authenticity Panel */}
            <div className="bg-sand p-5 flex flex-col gap-2">
              <span className="font-sans text-[10px] tracking-[0.26em] uppercase text-pressed font-medium">
                AUTHENTICITY
              </span>
              <p className="font-sans text-[12px] leading-[1.7] text-ink/80">
                Bought directly from the weaver's family in Kanchipuram and checked in our Erode shop. Silk mark on request. 7-day return, COD available, GST invoice with every order.
              </p>
            </div>
          </div>
        </div>

        {/* D4 "She also considered" section */}
        <div className="p-8 md:p-[64px] border-t border-ink/12 flex flex-col gap-6">
          <h2 className="font-display text-[34px] text-ink">She also considered</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedSarees.map((rel: any) => (
              <SareeCard key={rel.id} saree={rel} />
            ))}
          </div>
        </div>
      </div>

      <StickyBuyBar
        priceInPaise={saree.priceInPaise}
        onAddToBag={handleAddToBag}
        isSoldOut={isSoldOut}
      />
      <WhatsAppFab hasStickyBar />
    </div>
  );
}
