"use server";

import { orderInputSchema } from "@/model/schema/order.schema";
import { ActionResult, Order, paise } from "@/model/domain/types";
import { container } from "@/infrastructure/container";

export async function createOrder(input: unknown): Promise<ActionResult<Order>> {
  const parsed = orderInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: parsed.error.issues.map((i) => i.message).join(", "),
      },
    };
  }

  const { sareeId, customer, address, paymentMethod } = parsed.data;
  const saree = await container.sareeRepository.getById(sareeId);
  if (!saree || saree.status !== "available") {
    return {
      ok: false,
      error: {
        code: "JUST_SOLD",
        message: "This handpicked saree was just reserved or sold to another customer.",
      },
    };
  }

  const reference = `VLR-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = await container.orderRepository.createOrder({
    reference,
    status: "pending",
    items: [
      {
        sareeId: saree.id,
        slug: saree.slug,
        title: saree.title,
        priceInPaise: saree.priceInPaise,
        imageId: saree.images[0]?.id || "",
      },
    ],
    totals: {
      subtotalInPaise: saree.priceInPaise,
      shippingInPaise: paise(0),
      totalInPaise: saree.priceInPaise,
    },
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || undefined,
    },
    address: {
      line1: address.line1,
      line2: address.line2 || undefined,
      landmark: address.landmark || undefined,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
    },
    payment: {
      method: paymentMethod,
      provider: paymentMethod === "cod" ? "cod" : "razorpay",
    },
    timeline: [
      {
        status: "pending",
        at: new Date().toISOString(),
        note: `Order initialized via ${paymentMethod.toUpperCase()}`,
      },
    ],
  });

  return { ok: true, data: newOrder };
}
