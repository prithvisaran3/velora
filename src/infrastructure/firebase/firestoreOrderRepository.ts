import { OrderRepository } from "@/model/repository/orderRepository";
import { Order } from "@/model/domain/types";
import { adminDb } from "./admin";
import { orderConverter } from "./converters";

export class FirestoreOrderRepository implements OrderRepository {
  private collection() {
    return adminDb.collection("orders").withConverter(orderConverter as any);
  }

  async getByReference(reference: string): Promise<Order | null> {
    const snap = await this.collection().where("reference", "==", reference.toUpperCase()).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as Order;
  }

  async getByReferenceAndPhoneLast4(reference: string, phoneLast4: string): Promise<Order | null> {
    const order = await this.getByReference(reference);
    if (!order) return null;
    if (order.customer.phone.endsWith(phoneLast4)) {
      return order;
    }
    return null;
  }

  async createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    const docRef = this.collection().doc();
    const newOrder: Order = {
      ...orderData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await docRef.set(newOrder as any);
    return newOrder;
  }
}
