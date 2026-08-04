import { NextResponse } from "next/server";
import crypto from "crypto";
import { settlePayment } from "@/model/service/settlePayment";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, reference, method } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "mockSecret123";

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature)
      );

      if (!isSignatureValid) {
        return NextResponse.json({ ok: false, error: "Invalid Razorpay payment signature" }, { status: 400 });
      }
    }

    const result = await settlePayment({
      orderReference: reference,
      paymentMethod: method || "upi",
      provider: "razorpay",
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    });

    if (result.ok) {
      return NextResponse.json({ ok: true, order: result.order });
    } else {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
