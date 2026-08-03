"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import { getProductViewModel } from "@/viewmodel/server/product.viewmodel";
import { useCart } from "@/viewmodel/client/useCart";
import { Loupe } from "@/view/components/Loupe";
import { Price } from "@/view/primitives/Price";
import { Button } from "@/view/primitives/Button";
import { SareeCard } from "@/view/components/SareeCard";
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

  useEffect(() => {
    getProductViewModel(resolvedParams.slug).then(setVm);
  }, [resolvedParams.slug]);

  if (!vm) {
    return <div className="min-h-screen py-24 text-center font-display text-[20px]">Loading saree details...</div>;
  }

  const { saree, relatedSarees } = vm;
  const isSoldOut = saree.status === "sold";
  const isAddedToCart = cartItems.some((item: any) => item.id === saree.id);

  const mainImg = saree.images[selectedImgIdx]?.id;
  const isRealMainImg = mainImg && !mainImg.includes("icon-flat");

  return (
    <div className="w-full bg-[#FDF4E4]">
      <div className="max-w-[1440px] mx-auto border-b border-[#241F1C]/15">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* D4 Left 840px Media Column */}
          <div className="w-full md:w-[840px] flex flex-col border-r border-[#241F1C]/12 flex-shrink-0">
            <div className="relative h-[500px] md:h-[700px] placeholder-weave border-b border-[#241F1C]/10 flex items-center justify-center">
              <span className="absolute top-4 left-4 font-mono text-[10px] text-[#241F1C]/60 bg-[#FDF4E4]/90 px-2.5 py-1 z-20">
                flat-lay hero · 4:5 · LCP image
              </span>

              {isRealMainImg ? (
                <Loupe src={mainImg} alt={saree.title.en} className="w-full h-full" />
              ) : (
                <div className="w-[220px] md:w-[250px] h-[220px] md:h-[250px] rounded-full border-2 border-[#F5A623] placeholder-weave flex flex-col items-center justify-center text-center p-4">
                  <span className="font-mono text-[11px] text-[#241F1C]/75 leading-[1.6]">
                    loupe cursor · 3× macro<br />zari + weave detail<br />follows pointer, 220ms lag
                  </span>
                </div>
              )}
            </div>

            {/* 3 Tiles: Draped, Pallu Detail, Drape Video */}
            <div className="grid grid-cols-3 gap-[2px] bg-[#241F1C]/10">
              <div className="h-[140px] md:h-[180px] placeholder-weave flex items-end p-2.5">
                <span className="font-mono text-[9px] text-[#241F1C]/60">draped on model</span>
              </div>
              <div className="h-[140px] md:h-[180px] placeholder-weave flex items-end p-2.5">
                <span className="font-mono text-[9px] text-[#241F1C]/60">pallu detail</span>
              </div>
              <div className="h-[140px] md:h-[180px] bg-[#241F1C] text-[#FDF4E4] flex flex-col justify-end p-2.5 gap-1">
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#F5A623]">DRAPE VIDEO</span>
                <span className="font-mono text-[9px] text-[#FDF4E4]/65">6s · walking fabric</span>
              </div>
            </div>
          </div>

          {/* D4 Right Detail Column */}
          <div className="flex-1 p-8 md:p-[56px] flex flex-col gap-[26px]">
            <div className="flex flex-col gap-3">
              <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#B4470F] font-medium">
                HANDPICKED · JULY EDIT
              </span>
              <h1 className="font-display text-[36px] md:text-[52px] leading-[1.04] text-[#241F1C]">
                {saree.title.en}
              </h1>
              <div className="font-tamil text-[17px] text-[#241F1C]/75">
                {saree.title.ta}
              </div>
            </div>

            <div className="flex items-baseline gap-4 py-2 border-t border-b border-[#241F1C]/15">
              <Price amountInPaise={saree.priceInPaise} className="text-[32px] md:text-[38px]" />
              <span className="font-sans text-[11px] tracking-[0.16em] uppercase text-[#241F1C]/60">
                INCL. GST · FREE SHIPPING
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant={isSoldOut ? "disabled" : "primary"}
                onClick={() => addToCart(saree)}
                disabled={isSoldOut}
                className="py-5 text-[12px] tracking-[0.24em]"
                fullWidth
              >
                {isSoldOut ? "SOLD OUT" : isAddedToCart ? "ADDED TO BAG" : "ADD TO BAG"}
              </Button>

              <a
                href={`https://wa.me/919876543210?text=I'm%20interested%20in%20${encodeURIComponent(saree.title.en)}%20(${saree.slug})`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary" className="py-[19px] text-[12px] tracking-[0.24em]" fullWidth>
                  ASK ON WHATSAPP
                </Button>
              </a>

              <span className="font-mono text-[10px] text-[#241F1C]/55 leading-[1.6] mt-1">
                add-to-bag: image folds along two axes and flies to the bag icon (720ms), bag pulses once in marigold
              </span>
            </div>

            {/* Spec Table */}
            <div className="flex flex-col border-t border-b border-[#241F1C]/15 py-1 text-[12px] font-sans">
              <div className="flex justify-between py-3 border-b border-[#241F1C]/10">
                <span className="tracking-[0.16em] uppercase text-[#241F1C]/55">FABRIC</span>
                <span className="text-[#241F1C]">{saree.fabric}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#241F1C]/10">
                <span className="tracking-[0.16em] uppercase text-[#241F1C]/55">LENGTH</span>
                <span className="text-[#241F1C]">{(saree.lengthCm / 100).toFixed(1)} m incl. blouse</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#241F1C]/10">
                <span className="tracking-[0.16em] uppercase text-[#241F1C]/55">BLOUSE PIECE</span>
                <span className="text-[#241F1C]">{(saree.blousePieceCm / 100).toFixed(1)} m, attached</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#241F1C]/10">
                <span className="tracking-[0.16em] uppercase text-[#241F1C]/55">ZARI</span>
                <span className="text-[#241F1C]">{saree.zari}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[#241F1C]/10">
                <span className="tracking-[0.16em] uppercase text-[#241F1C]/55">CARE</span>
                <span className="text-[#241F1C]">{saree.care}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="tracking-[0.16em] uppercase text-[#241F1C]/55">WEIGHT</span>
                <span className="text-[#241F1C]">{saree.weightGrams} g</span>
              </div>
            </div>

            {/* D4 Authenticity Panel */}
            <div className="bg-[#F6EAD6] p-5 flex flex-col gap-2">
              <span className="font-sans text-[10px] tracking-[0.26em] uppercase text-[#B4470F] font-medium">
                AUTHENTICITY
              </span>
              <p className="font-sans text-[12px] leading-[1.7] text-[#241F1C]/80">
                Bought directly from the weaver's family in Kanchipuram and checked in our Erode shop. Silk mark on request. 7-day return, COD available, GST invoice with every order.
              </p>
            </div>
          </div>
        </div>

        {/* D4 "She also considered" section */}
        <div className="p-8 md:p-[64px] border-t border-[#241F1C]/12 flex flex-col gap-6">
          <h2 className="font-display text-[34px] text-[#241F1C]">She also considered</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedSarees.map((rel: any) => (
              <SareeCard key={rel.id} saree={rel} />
            ))}
          </div>
        </div>
      </div>

      <StickyBuyBar
        priceInPaise={saree.priceInPaise}
        onAddToBag={() => addToCart(saree)}
        isSoldOut={isSoldOut}
      />
      <WhatsAppFab hasStickyBar />
    </div>
  );
}
