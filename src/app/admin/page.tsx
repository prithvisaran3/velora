"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/view/primitives/Button";
import { Badge } from "@/view/primitives/Badge";
import { Price } from "@/view/primitives/Price";
import { OrderStatus, paise } from "@/model/domain/types";
import { transitionOrderStatus } from "@/model/service/orderStateMachine";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([
    {
      id: "ord-4821",
      reference: "VLR-4821",
      status: "paid" as OrderStatus,
      customer: { name: "Ananya Sundaram", phone: "9876543210" },
      address: { line1: "42 Heritage Enclave", city: "Coimbatore", state: "Tamil Nadu", pincode: "641018" },
      sareeTitle: "Deep Maroon Mangai Motif Silk Saree",
      amountInPaise: paise(300000),
      createdAt: "2026-08-03T14:30:00Z",
    },
  ]);

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
      pending: "paid",
      paid: "packed",
      packed: "shipped",
      shipped: "out_for_delivery",
      out_for_delivery: "delivered",
    };

    const targetStatus = nextStatusMap[currentStatus];
    if (!targetStatus) return;

    try {
      const { newStatus } = transitionOrderStatus(currentStatus, targetStatus, "Advanced via Mobile Admin");
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6 flex flex-col gap-6 min-h-screen bg-[#FDF4E4]">
      {/* Mobile Admin Header */}
      <div className="flex items-center justify-between border-b border-[#241F1C]/15 pb-4">
        <div className="flex flex-col">
          <span className="wordmark text-[24px] text-ink">VELORA</span>
          <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#E8621B]">
            MOBILE ADMIN PWA · ERODE
          </span>
        </div>

        <Link href="/admin/add">
          <Button variant="primary" className="h-[44px] px-4 text-[10px]">
            + ADD SAREE
          </Button>
        </Link>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-[#F6EAD6] p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-sans text-[11px] font-medium text-ink">Quick Add Inventory</span>
          <span className="font-sans text-[10px] opacity-75">Duplicate previous saree specs in 20 sec</span>
        </div>
        <Link href="/admin/add?duplicate=true">
          <Button variant="secondary" className="h-[38px] px-3 text-[9px]">
            DUPLICATE LAST
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-[20px] text-ink">Recent Customer Orders ({orders.length})</h2>

        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-[#241F1C]/15 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[12px] font-bold text-[#E8621B]">{order.reference}</span>
              <Badge variant={order.status === "paid" ? "pressed" : "cream"}>
                {order.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex flex-col text-[13px] font-sans text-ink">
              <span className="font-medium">{order.sareeTitle}</span>
              <Price amountInPaise={order.amountInPaise} className="text-[14px] font-medium mt-0.5" />
            </div>

            <div className="flex flex-col text-[12px] font-sans opacity-80 border-t border-[#241F1C]/10 pt-2 gap-1">
              <span>Customer: {order.customer.name}</span>
              <div className="flex items-center gap-3">
                <a href={`tel:${order.customer.phone}`} className="text-[#E8621B] underline font-medium">
                  📞 {order.customer.phone}
                </a>
                <a
                  href={`https://wa.me/91${order.customer.phone}?text=Hello%20${encodeURIComponent(order.customer.name)}%2C%20regarding%20your%20Velora%20order%20${order.reference}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#12514E] underline font-medium"
                >
                  💬 WhatsApp
                </a>
              </div>
              <span className="mt-1">{order.address.line1}, {order.address.city}, {order.address.state} — {order.address.pincode}</span>
            </div>

            {/* Single-tap Status Advance */}
            {order.status !== "delivered" && (
              <Button
                variant="primary"
                onClick={() => handleAdvanceStatus(order.id, order.status)}
                className="h-[44px] text-[10px] mt-2"
              >
                ADVANCE STATUS → {order.status === "paid" ? "PACKED" : order.status === "packed" ? "SHIPPED" : "NEXT"}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
