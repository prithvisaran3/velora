"use server";

import { ActionResult, paise } from "@/model/domain/types";
import { adminDb } from "@/infrastructure/firebase/admin";

export interface RazorpayOrderResult {
  orderId: string;
  amountInPaise: number;
  currency: string;
  keyId: string;
  reference: string;
}

export async function createRazorpayOrder(reference: string): Promise<ActionResult<RazorpayOrderResult>> {
  const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_mockKey123";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "mockSecret123";

  const ordersSnap = await adminDb.collection("orders").where("reference", "==", reference.toUpperCase()).limit(1).get();
  if (ordersSnap.empty) {
    return { ok: false, error: { code: "ORDER_NOT_FOUND", message: `Order ${reference} not found` } };
  }

  const orderDoc = ordersSnap.docs[0];
  const orderData = orderDoc.data();
  const sareeId = orderData.items[0]?.sareeId;

  // Recompute amount from Saree document server-side
  let amountInPaise = orderData.totals.totalInPaise;
  if (sareeId) {
    const sareeDoc = await adminDb.collection("sarees").doc(sareeId).get();
    if (sareeDoc.exists) {
      const sareeData = sareeDoc.data();
      if (sareeData?.priceInPaise) {
        amountInPaise = sareeData.priceInPaise;
      }
    }
  }

  const rzpOrderId = `order_${Math.random().toString(36).slice(2, 11)}`;

  await orderDoc.ref.update({
    "payment.razorpayOrderId": rzpOrderId,
    updatedAt: new Date().toISOString(),
  });

  return {
    ok: true,
    data: {
      orderId: rzpOrderId,
      amountInPaise,
      currency: "INR",
      keyId,
      reference: orderData.reference,
    },
  };
}
