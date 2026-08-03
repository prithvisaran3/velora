import { Order } from "@/model/domain/types";
import { generateOrderConfirmationEmailHtml } from "./orderConfirmationTemplate";

export async function sendOrderConfirmationEmail(order: Order): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[Resend Mock] Email notification logged for order ${order.reference} to ${order.customer.email || order.customer.phone}`);
    return { ok: true, messageId: `mock_${Date.now()}` };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.SENDER_EMAIL || "orders@velora.in",
        to: [order.customer.email || "customer@example.com"],
        subject: `Velora Order Confirmed — ${order.reference}`,
        html: generateOrderConfirmationEmailHtml(order),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      return { ok: true, messageId: data.id };
    } else {
      return { ok: false, error: data.message };
    }
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}
