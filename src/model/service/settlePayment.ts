import { adminDb } from "@/infrastructure/firebase/admin";
import { Order, OrderStatus, TimelineEntry, paise } from "../domain/types";
import { sendOrderConfirmationEmail } from "@/infrastructure/resend/send";

export interface SettlePaymentOptions {
  orderReference: string;
  paymentMethod: "upi" | "cod" | "card" | "netbanking";
  provider: "razorpay" | "cod";
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  rawPayload?: any;
}

export async function settlePayment(options: SettlePaymentOptions): Promise<{ ok: boolean; order?: Order; error?: string }> {
  try {
    const ordersSnap = await adminDb.collection("orders").where("reference", "==", options.orderReference.toUpperCase()).limit(1).get();
    if (ordersSnap.empty) {
      return { ok: false, error: `Order ${options.orderReference} not found` };
    }

    const orderDoc = ordersSnap.docs[0];
    const order = orderDoc.data() as Order;

    // Idempotent check: if already settled or paid, return success without duplicating
    if (order.status === "paid" || order.status === "packed" || order.status === "shipped" || order.status === "delivered") {
      return { ok: true, order };
    }

    const now = new Date().toISOString();
    const newStatus: OrderStatus = options.paymentMethod === "cod" ? "pending" : "paid";

    const timelineEntry: TimelineEntry = {
      status: newStatus,
      at: now,
      note: options.paymentMethod === "cod" ? "COD Order Confirmed" : `Paid via ${options.paymentMethod.toUpperCase()} (${options.razorpayPaymentId || "Captured"})`,
    };

    const updatedOrder: Order = {
      ...order,
      status: newStatus,
      payment: {
        ...order.payment,
        method: options.paymentMethod,
        provider: options.provider,
        razorpayPaymentId: options.razorpayPaymentId || order.payment.razorpayPaymentId,
        razorpayOrderId: options.razorpayOrderId || order.payment.razorpayOrderId,
        paidAt: now,
      },
      timeline: [...order.timeline, timelineEntry],
      updatedAt: now,
    };

    const batch = adminDb.batch();

    // 1. Update Order document
    batch.set(orderDoc.ref, updatedOrder);

    // 2. Mark Saree as Sold
    if (order.items[0]?.sareeId) {
      const sareeRef = adminDb.collection("sarees").doc(order.items[0].sareeId);
      batch.update(sareeRef, { status: "sold", updatedAt: now });
    }

    // 3. Record Payment Log
    const payLogRef = adminDb.collection("payments").doc(`pay_${Date.now()}`);
    batch.set(payLogRef, {
      id: payLogRef.id,
      orderId: order.id,
      orderReference: order.reference,
      amountInPaise: order.totals.totalInPaise,
      currency: "INR",
      method: options.paymentMethod,
      status: options.paymentMethod === "cod" ? "initiated" : "captured",
      gatewayProvider: options.provider,
      gatewayPaymentId: options.razorpayPaymentId || null,
      gatewayOrderId: options.razorpayOrderId || null,
      customerPhone: order.customer.phone,
      createdAt: now,
    });

    await batch.commit();

    // Trigger Confirmation Email asynchronously
    sendOrderConfirmationEmail(updatedOrder).catch((err) =>
      console.error("[Email Error]", err)
    );

    return { ok: true, order: updatedOrder };
  } catch (err: any) {
    console.error("[Settle Payment Error]", err);
    return { ok: false, error: err.message };
  }
}
