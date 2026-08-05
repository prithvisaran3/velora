"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/view/primitives/Button";
import { Badge } from "@/view/primitives/Badge";
import { Price } from "@/view/primitives/Price";
import { OrderStatus, paise, Order } from "@/model/domain/types";
import { transitionOrderStatus } from "@/model/service/orderStateMachine";
import { db } from "@/infrastructure/firebase/client";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(fetched);
      } catch (e) {
        console.error("Failed to fetch orders", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAdvanceStatus = async (orderId: string, currentStatus: OrderStatus) => {
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
      const { newStatus, entry } = transitionOrderStatus(currentStatus, targetStatus, "Advanced via Mobile Admin");
      const orderRef = doc(db, "orders", orderId);
      
      const targetOrder = orders.find(o => o.id === orderId);
      if (!targetOrder) return;

      const newTimeline = [...(targetOrder.timeline || []), entry];

      await updateDoc(orderRef, {
        status: newStatus,
        timeline: newTimeline,
        updatedAt: new Date().toISOString()
      });

      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus, timeline: newTimeline } : o)));
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-6 flex flex-col gap-6 min-h-screen bg-cream">
      {/* Mobile Admin Header */}
      <div className="flex flex-col gap-3 border-b border-ink/15 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="wordmark text-[24px] text-ink">VELORA</span>
            <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-saffron">
              MOBILE ADMIN PWA · ERODE
            </span>
          </div>

          <Link href="/admin/add">
            <Button variant="primary" className="h-[44px] px-4 text-[10px]">
              + ADD SAREE
            </Button>
          </Link>
        </div>

        {/* Quick Admin Subnav Links */}
        <div className="flex items-center gap-4 font-sans text-[11px] uppercase tracking-wider text-ink/80 pt-1">
          <Link href="/admin" className="font-bold text-saffron underline">ORDERS</Link>
          <Link href="/admin/offers" className="hover:text-saffron">OFFERS</Link>
          <Link href="/admin/payments" className="hover:text-saffron">PAYMENTS</Link>
          <Link href="/admin/add" className="hover:text-saffron">+ SAREE</Link>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-sand p-4 flex items-center justify-between border border-ink/10">
        <div className="flex flex-col">
          <span className="font-sans text-[11px] font-medium text-ink">Quick Add Inventory</span>
          <span className="font-sans text-[10px] opacity-75">Duplicate previous saree specs in 20 sec</span>
        </div>
        <Link href="/admin/add">
          <Button variant="secondary" className="h-[38px] px-3 text-[9px]">
            DUPLICATE LAST
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-[20px] text-ink">Recent Customer Orders ({orders.length})</h2>

        {orders.map((order) => (
          <div key={order.id} className="bg-panel border border-ink/15 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[12px] font-bold text-saffron">{order.reference}</span>
              <Badge variant={order.status === "paid" ? "pressed" : "cream"}>
                {order.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex flex-col text-[13px] font-sans text-ink">
              <span className="font-medium">{order.items?.[0]?.title?.en || "Saree"}</span>
              <Price amountInPaise={order.totals?.totalInPaise || order.items?.[0]?.priceInPaise || paise(0)} className="text-[14px] font-medium mt-0.5" />
            </div>

            <div className="flex flex-col text-[12px] font-sans opacity-80 border-t border-ink/10 pt-2 gap-1">
              <span>Customer: {order.customer.name}</span>
              <div className="flex items-center gap-3">
                <a href={`tel:${order.customer.phone}`} className="text-saffron underline font-medium">
                  📞 {order.customer.phone}
                </a>
                <a
                  href={`https://wa.me/91${order.customer.phone}?text=Hello%20${encodeURIComponent(order.customer.name)}%2C%20regarding%20your%20Velora%20order%20${order.reference}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-peacock underline font-medium"
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
