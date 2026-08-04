import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/infrastructure/firebase/admin";
import { settlePayment } from "@/model/service/settlePayment";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "mockWebhookSecret123";

    if (signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        return NextResponse.json({ ok: false, error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.contains?.[0] || `evt_${Date.now()}`;

    // Event Deduplication via Firestore
    const webhookRef = adminDb.collection("processedWebhooks").doc(eventId);
    const webhookDoc = await webhookRef.get();
    if (webhookDoc.exists) {
      return NextResponse.json({ ok: true, message: "Event already processed" });
    }

    const event = payload.event;
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderRef = paymentEntity?.notes?.reference || paymentEntity?.description;

      if (orderRef) {
        await settlePayment({
          orderReference: orderRef,
          paymentMethod: paymentEntity.method || "upi",
          provider: "razorpay",
          razorpayPaymentId: paymentEntity.id,
          razorpayOrderId: paymentEntity.order_id,
          rawPayload: payload,
        });
      }
    }

    await webhookRef.set({ processedAt: new Date().toISOString(), event });

    return NextResponse.json({ ok: true, event });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
