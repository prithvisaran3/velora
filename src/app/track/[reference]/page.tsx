"use client";

import React, { use, useState, useEffect } from "react";
import { getOrderTrackingVM } from "@/viewmodel/server/order.viewmodel";
import { ZariStepper } from "@/view/components/ZariStepper";
import { Button } from "@/view/primitives/Button";
import { Price } from "@/view/primitives/Price";
import { verifyTrackingAccess } from "@/viewmodel/actions/verifyTrackingAccess";
import { UI } from "@/content/ui";

interface TrackingPageProps {
  params: Promise<{ reference: string }>;
}

export default function TrackingPage({ params }: TrackingPageProps) {
  const resolvedParams = use(params);
  const reference = resolvedParams.reference || "VLR-4821";

  const [isVerified, setIsVerified] = useState(false);
  const [phoneLast4, setPhoneLast4] = useState("3210");
  const [errorMsg, setErrorMsg] = useState("");
  const [vm, setVm] = useState<any>(null);

  useEffect(() => {
    getOrderTrackingVM(reference).then(setVm);
  }, [reference]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const res = await verifyTrackingAccess(reference, phoneLast4);
    if (res.ok) {
      setIsVerified(true);
    } else {
      setErrorMsg(res.error.message);
    }
  };

  if (!vm) {
    return <div className="min-h-screen py-24 text-center font-display text-[20px]">Loading order tracking...</div>;
  }

  const { order } = vm;

  return (
    <div className="w-full bg-cream min-h-screen">
      {/* Phone Verification Modal if not verified yet */}
      {!isVerified ? (
        <div className="max-w-[480px] mx-auto px-6 py-20 flex flex-col gap-6 text-center">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[11px] tracking-label-wide uppercase text-saffron font-bold">
              SECURITY VERIFICATION
            </span>
            <h1 className="font-display text-[38px] text-ink">Track Order {order.reference}</h1>
            <p className="font-sans text-[13px] text-ink/75 leading-[1.6]">
              To protect customer privacy, please enter the last 4 digits of the mobile number registered with this order.
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-4 bg-white p-6 border border-ink/15">
            <input
              type="text"
              maxLength={4}
              required
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value)}
              placeholder="e.g. 3210"
              className="w-full border border-ink/30 p-3 text-center font-mono text-[20px] text-ink tracking-widest bg-transparent focus:outline-none focus:border-saffron"
            />
            {errorMsg && <span className="font-sans text-[11px] text-pressed">{errorMsg}</span>}
            <Button variant="primary" type="submit" className="py-4 text-[11px] tracking-label">
              VERIFY & VIEW TRACKING
            </Button>
          </form>
        </div>
      ) : (
        /* Verified D7 Order Tracking Container */
        <div className="max-w-[1440px] mx-auto px-8 md:px-[64px] py-[64px] flex flex-col gap-[44px]">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-ink/12 pb-6">
            <div className="flex flex-col gap-[12px]">
              <span className="font-sans text-[11px] tracking-label-wide uppercase text-ink/55">
                ORDER {order.reference}
              </span>
              <h1 className="font-display text-[38px] md:text-[52px] text-ink">
                On its way to {order.address.city || "Coimbatore"}
              </h1>
            </div>

            <div className="font-sans text-[12px] tracking-[0.14em] text-ink/70 md:text-right leading-[1.9] uppercase">
              Expected Thursday, 6 August<br />
              {order.shipment?.courier || "BlueDart Express"} · AWB {order.shipment?.awb || "SR19784821IN"}<br />
              Paid by {order.payment.method.toUpperCase()} · GST invoice sent
            </div>
          </div>

          {/* D7 Zari Stepper */}
          <div className="relative py-6">
            <ZariStepper currentStatus={order.status} />
            <div className="font-mono text-[10px] text-ink/55 text-center mt-6">
              completed track is a two-tone zari weave; on each status change the new segment is drawn left→right in 900ms, then the reached node fades up
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-sand p-6 border border-ink/15 flex flex-col gap-3">
            <span className="font-sans text-[10px] tracking-[0.26em] uppercase text-pressed font-bold">
              ORDER SUMMARY
            </span>
            <div className="flex justify-between items-center text-[14px] font-sans">
              <span>{order.items[0]?.title.en || "Handpicked Saree"}</span>
              <Price amountInPaise={order.totals.totalInPaise} className="font-medium" />
            </div>
            <span className="font-sans text-[11px] text-ink/70">
              Delivery to: {order.customer.name}, {order.address.line1}, {order.address.city}, {order.address.state} — {order.address.pincode}
            </span>
          </div>

          {/* WhatsApp Help Button */}
          <div className="flex flex-col items-center justify-center gap-4 py-8 border-t border-ink/12">
            <span className="font-sans text-[13px] text-ink/75">
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
      )}
    </div>
  );
}
