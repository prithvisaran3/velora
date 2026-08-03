import { Order } from "../domain/types";

export interface OrderRepository {
  getByReference(reference: string): Promise<Order | null>;
  getByReferenceAndPhoneLast4(reference: string, phoneLast4: string): Promise<Order | null>;
  createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order>;
}
