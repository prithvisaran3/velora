import React from "react";
import Link from "next/link";
import { Button } from "@/view/primitives/Button";
import { container } from "@/infrastructure/container";

export default async function OffersPage() {
  const activeOffers = await container.offerRepository.listActive();

  const fallbackOffers = [
    {
      id: "off-01",
      code: "FESTIVE500",
      title: { en: "Festive Curation Special", ta: "விழா சிறப்பு தள்ளுபடி" },
      description: {
        en: "Flat ₹500 discount on handpicked silk sarees when you order today.",
        ta: "இன்று பட்டுப்புடவைகள் வாங்கும் போது ₹500 சிறப்பு தள்ளுபடி.",
      },
      discountType: "fixed_paise",
      discountValue: 500,
      validUntil: "2026-09-30",
    },
    {
      id: "off-02",
      code: "WELCOME10",
      title: { en: "First Saree Welcome Offer", ta: "முதல் புடவை வரவேற்பு சலுகை" },
      description: {
        en: "Get 10% off on your first modern saree order with code WELCOME10.",
        ta: "உங்கள் முதல் ஆர்டருக்கு WELCOME10 குறியீட்டுடன் 10% தள்ளுபடி பெறுங்கள்.",
      },
      discountType: "percentage",
      discountValue: 10,
      validUntil: "2026-12-31",
    },
  ];

  const offersToDisplay = activeOffers.length > 0 ? activeOffers : fallbackOffers;

  return (
    <div className="w-full bg-[#FDF4E4] min-h-screen flex flex-col">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-14 flex flex-col gap-4 text-center md:text-left">
        <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#B4470F] font-medium">
          CURATED SAVINGS · BHARANI PATTU
        </span>
        <h1 className="font-display text-[48px] md:text-[72px] leading-[0.98] text-[#241F1C]">
          Offers & Festivities
        </h1>
        <p className="font-sans text-[15px] leading-[1.75] text-[#241F1C]/78 max-w-[620px]">
          Direct prices from our family shop in Erode, with special festive vouchers and complimentary gifts on handpicked modern sarees.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] pb-16 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {offersToDisplay.map((offer: any) => (
          <div key={offer.id} className="bg-white border border-[#241F1C]/15 p-8 flex flex-col justify-between gap-6 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-[#241F1C]/10 pb-3">
                <span className="font-mono text-[14px] font-bold text-[#E8621B] bg-[#FBEEDF] px-3 py-1 border border-[#E8621B]/30">
                  CODE: {offer.code}
                </span>
                <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#241F1C]/55">
                  VALID UNTIL {new Date(offer.validUntil).toLocaleDateString("en-IN")}
                </span>
              </div>

              <h2 className="font-display text-[28px] text-[#241F1C] mt-2">
                {offer.title.en}
              </h2>
              <div className="font-tamil text-[16px] text-[#241F1C]/75">
                {offer.title.ta}
              </div>

              <p className="font-sans text-[14px] leading-[1.7] text-[#241F1C]/80 mt-1">
                {offer.description.en}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#241F1C]/10">
              <span className="font-sans text-[11px] tracking-[0.16em] uppercase text-[#B4470F] font-medium">
                APPLY AT CHECKOUT
              </span>
              <Link href="/colour/maroon">
                <Button variant="primary" className="py-3 px-6 text-[10px]">
                  SHOP SAREES
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
