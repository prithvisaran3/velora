"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/view/primitives/Badge";
import { Price } from "@/view/primitives/Price";
import { PaymentRecord, paise } from "@/model/domain/types";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: "pay-101",
      orderId: "ord-4821",
      orderReference: "VLR-4821",
      amountInPaise: paise(385000),
      currency: "INR",
      method: "upi",
      status: "captured",
      gatewayProvider: "razorpay",
      gatewayPaymentId: "pay_rzp_987412304",
      customerPhone: "9876543210",
      createdAt: "2026-08-03T14:35:00Z",
    },
    {
      id: "pay-102",
      orderId: "ord-4822",
      orderReference: "VLR-4822",
      amountInPaise: paise(420000),
      currency: "INR",
      method: "cod",
      status: "initiated",
      gatewayProvider: "cod",
      customerPhone: "9443312345",
      createdAt: "2026-08-03T16:10:00Z",
    },
  ]);

  const totalRevenuePaise = payments
    .filter((p) => p.status === "captured")
    .reduce((sum, p) => sum + p.amountInPaise, 0);

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6 flex flex-col gap-6 min-h-screen bg-[#FDF4E4]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#241F1C]/15 pb-4">
        <Link href="/admin" className="font-sans text-[12px] uppercase tracking-widest text-[#E8621B]">
          ← Back to Orders
        </Link>
        <span className="font-display text-[20px] text-ink">Payment History</span>
      </div>

      {/* Revenue Card */}
      <div className="bg-[#241F1C] text-[#FDF4E4] p-5 flex items-center justify-between shadow-sm">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#F5A623]">
            CAPTURED PAYMENTS
          </span>
          <span className="font-display text-[32px] text-[#FDF4E4]">
            ₹{(totalRevenuePaise / 100).toLocaleString("en-IN")}
          </span>
        </div>
        <span className="font-sans text-[11px] text-[#FDF4E4]/70">
          {payments.length} Transactions
        </span>
      </div>

      {/* Payment Records List */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-[18px] text-ink">Transaction History Log</h2>

        {payments.map((record) => (
          <div key={record.id} className="bg-white border border-[#241F1C]/15 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[13px] font-bold text-[#E8621B]">
                {record.orderReference}
              </span>
              <Badge variant={record.status === "captured" ? "pressed" : "cream"}>
                {record.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="font-sans text-[12px] uppercase tracking-wider text-ink font-medium">
                METHOD: {record.method.toUpperCase()} ({record.gatewayProvider.toUpperCase()})
              </span>
              <Price amountInPaise={record.amountInPaise} className="text-[16px] font-medium" />
            </div>

            <div className="flex flex-col font-mono text-[11px] text-[#241F1C]/65 border-t border-[#241F1C]/10 pt-2 gap-1">
              {record.gatewayPaymentId && (
                <span>Gateway ID: {record.gatewayPaymentId}</span>
              )}
              <span>Customer: {record.customerPhone}</span>
              <span>Time: {new Date(record.createdAt).toLocaleString("en-IN")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
