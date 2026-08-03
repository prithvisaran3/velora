import { OrderStatus, TimelineEntry } from "../domain/types";

export class InvalidTransitionError extends Error {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Invalid order status transition: ${from} -> ${to}`);
    this.name = "InvalidTransitionError";
  }
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["packed", "refunded", "cancelled"],
  packed: ["shipped", "refunded"],
  shipped: ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
  refunded: [],
};

export function transitionOrderStatus(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
  note?: string,
  carrierEventId?: string
): { newStatus: OrderStatus; entry: TimelineEntry } {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw new InvalidTransitionError(currentStatus, nextStatus);
  }

  const entry: TimelineEntry = {
    status: nextStatus,
    at: new Date().toISOString(),
    note,
    carrierEventId,
  };

  return {
    newStatus: nextStatus,
    entry,
  };
}
