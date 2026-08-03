"use client";

import React, { use, useState, useEffect } from "react";
import { getOrderTrackingVM } from "@/viewmodel/server/order.viewmodel";
import { ZariStepper } from "@/view/components/ZariStepper";
import { Button } from "@/view/primitives/Button";

interface TrackingPageProps {
  params: Promise<{ reference: string }>;
}

export default function TrackingPage({ params }: TrackingPageProps) {
  const resolvedParams = use(params);
  const reference = resolvedParams.reference || "VLR-4821";

  const [vm, setVm] = useState<any>(null);

  useEffect(() => {
    getOrderTrackingVM(reference).then(setVm);
  }, [reference]);

  if (!vm) {
    return <div className="min-h-screen py-24 text-center">Loading order tracking...</div>;
  }

  const { order } = vm;

  return (
    <div className="w-full bg-[#FDF4E4] min-h-screen">
      {/* D7 Order Tracking Container */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-[64px] py-[64px] flex flex-col gap-[44px]">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-[#241F1C]/12 pb-6">
          <div className="flex flex-col gap-[12px]">
            <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#241F1C]/55">
              ORDER {order.reference}
            </span>
            <h1 className="font-display text-[38px] md:text-[52px] text-[#241F1C]">
              On its way to {order.address.city || "Coimbatore"}
            </h1>
          </div>

          <div className="font-sans text-[12px] tracking-[0.14em] text-[#241F1C]/70 md:text-right leading-[1.9]">
            Expected Thursday, 6 August<br />
            {order.shipment?.courier || "BlueDart Express"} · AWB {order.shipment?.awb || "SR19784821IN"}<br />
            Paid by {order.payment.method.toUpperCase()} · GST invoice sent
          </div>
        </div>

        {/* D7 Zari Stepper */}
        <div className="relative py-6">
          <ZariStepper currentStatus={order.status} />
          <div className="font-mono text-[10px] text-[#241F1C]/55 text-center mt-6">
            completed track is a two-tone zari weave; on each status change the new segment is drawn left→right in 900ms, then the reached node fades up
          </div>
        </div>

        {/* WhatsApp Help Button */}
        <div className="flex flex-col items-center justify-center gap-4 py-8 border-t border-[#241F1C]/12">
          <span className="font-sans text-[13px] text-[#241F1C]/75">
            Need help with your delivery or order details?
          </span>
          <a
            href={`https://wa.me/919876543210?text=Order%20${order.reference}%20—%20${encodeURIComponent(order.items[0]?.title.en || "Saree")}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="whatsapp" className="px-8 py-4">
              ASK ON WHATSAPP
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
