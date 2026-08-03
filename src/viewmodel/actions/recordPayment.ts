"use server";

import { paymentRecordSchema } from "@/model/schema/payment.schema";
import { ActionResult, PaymentRecord, paise } from "@/model/domain/types";
import { container } from "@/infrastructure/container";

export async function recordPayment(input: unknown): Promise<ActionResult<PaymentRecord>> {
  const parsed = paymentRecordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: parsed.error.issues.map((i) => i.message).join(", "),
      },
    };
  }

  const data = parsed.data;
  const id = `pay-${Date.now()}`;

  const record: PaymentRecord = {
    id,
    orderId: data.orderId,
    orderReference: data.orderReference,
    amountInPaise: paise(data.amountInRupees * 100),
    currency: "INR",
    method: data.method,
    status: data.status,
    gatewayProvider: data.gatewayProvider,
    gatewayPaymentId: data.gatewayPaymentId,
    gatewayOrderId: data.gatewayOrderId,
    failureReason: data.failureReason,
    customerPhone: data.customerPhone,
    createdAt: new Date().toISOString(),
  };

  await container.paymentRepository.recordPayment(record);
  return { ok: true, data: record };
}
