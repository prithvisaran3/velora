import { z } from "zod";

export const paymentRecordSchema = z.object({
  orderId: z.string().min(1),
  orderReference: z.string().min(1),
  amountInRupees: z.number().positive(),
  method: z.enum(["upi", "cod", "card", "netbanking"]),
  status: z.enum(["initiated", "captured", "failed", "refunded"]),
  gatewayProvider: z.enum(["razorpay", "cod"]),
  gatewayPaymentId: z.string().optional(),
  gatewayOrderId: z.string().optional(),
  failureReason: z.string().optional(),
  customerPhone: z.string().min(10),
});

export type PaymentRecordInput = z.infer<typeof paymentRecordSchema>;
