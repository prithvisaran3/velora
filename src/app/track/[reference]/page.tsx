"use client";

import React, { use, useState, useEffect } from "react";
import { getOrderTrackingVM } from "@/viewmodel/server/order.viewmodel";
import type { OrderTrackingViewModel } from "@/viewmodel/server/order.viewmodel";
import { ThreadTracker } from "@/view/thread/ThreadTracker";
import { ThreadField } from "@/view/thread/ThreadField";
import { ThreadLoaderPage } from "@/view/thread/ThreadLoader";
import { Button } from "@/view/primitives/Button";
import { Price } from "@/view/primitives/Price";
import { verifyTrackingAccess } from "@/viewmodel/actions/verifyTrackingAccess";
import { UI } from "@/content/ui";

interface TrackingPageProps {
  params: Promise<{ reference: string }>;
}

export default function TrackingPage({ params }: TrackingPageProps) {
  const { reference: raw } = use(params);
  const reference = raw || "VLR-4821";

  const [isVerified, setIsVerified] = useState(false);
  const [phoneLast4, setPhoneLast4] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [vm, setVm] = useState<OrderTrackingViewModel | null>(null);

  useEffect(() => {
    getOrderTrackingVM(reference).then(setVm);
  }, [reference]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");
    const res = await verifyTrackingAccess(reference, phoneLast4);
    if (res.ok) setIsVerified(true);
    else setErrorMsg(res.error.message);
  };

  if (!vm) return <ThreadLoaderPage label={UI.loading.order} />;

  const { order } = vm;

  if (!isVerified) {
    return (
      <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-20 text-center">
        <div className="flex flex-col gap-2">
          <span className="font-sans text-[10px] font-medium uppercase tracking-label-wide text-saffron">
            {UI.tracking.verifyEyebrow}
          </span>
          <h1 className="font-display text-[34px]">Track order {order.reference}</h1>
          <p className="m-0 font-sans text-[13px] leading-[1.7] text-ink/75">
            {UI.tracking.verifyBody}
          </p>
        </div>

        <form
          onSubmit={handleVerify}
          className="flex flex-col gap-4 border border-ink/15 bg-panel p-6"
        >
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            required
            value={phoneLast4}
            onChange={(e) => setPhoneLast4(e.target.value)}
            placeholder="1234"
            aria-label="Last 4 digits of your mobile number"
            className="w-full border border-ink/30 bg-transparent p-3 text-center font-mono text-[20px] tracking-widest focus:border-saffron focus:outline-none"
          />
          {errorMsg && <span className="font-sans text-[11px] text-pressed">{errorMsg}</span>}
          <Button variant="primary" type="submit" fullWidth>
            {UI.tracking.verifyCta}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-11 px-4 pb-20 pt-6 md:px-[60px]">
      <section className="thread-ground relative overflow-hidden border border-ink/12">
        <ThreadField variant="band" />
        <div className="relative z-10 flex flex-col justify-between gap-6 px-6 py-10 md:flex-row md:items-end md:px-11 md:py-12">
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-label-wide text-ink/55">
              ORDER {order.reference}
            </span>
            <h1 className="font-display text-[32px] leading-[1.05] md:text-[48px]">
              On its way to {order.address.city}
            </h1>
          </div>

          <div className="font-sans text-[11px] uppercase leading-[1.9] tracking-[0.14em] text-ink/70 md:text-right">
            {order.shipment?.courier && <>{order.shipment.courier}<br /></>}
            {order.shipment?.awb && <>AWB {order.shipment.awb}<br /></>}
            Paid by {order.payment.method.toUpperCase()} · GST invoice sent
          </div>
        </div>
      </section>

      <ThreadTracker currentStatus={order.status} reference={order.reference} />

      <div className="flex flex-col gap-3 border border-ink/15 bg-panel p-6">
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.26em] text-saffron">
          ORDER SUMMARY
        </span>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {order.items.map((item) => (
            <li key={item.sareeId} className="flex justify-between gap-4 font-sans text-[14px]">
              <span>{item.title.en}</span>
              <Price amountInPaise={item.priceInPaise} className="font-sans text-[14px]" />
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-ink/15 pt-3 font-display text-[18px]">
          <span>Total</span>
          <Price amountInPaise={order.totals.totalInPaise} className="font-display text-[18px]" />
        </div>
        <span className="font-sans text-[11px] leading-[1.7] text-ink/70">
          Delivery to {order.customer.name}, {order.address.line1}, {order.address.city},{" "}
          {order.address.state} — {order.address.pincode}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 border-t border-ink/12 py-8">
        <span className="font-sans text-[13px] text-ink/75">
          Need help with your delivery or order details?
        </span>
        <a
          href={`https://wa.me/919876543210?text=${encodeURIComponent(`Order ${order.reference}`)}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="whatsapp">{UI.tracking.askWhatsapp}</Button>
        </a>
      </div>
    </div>
  );
}
