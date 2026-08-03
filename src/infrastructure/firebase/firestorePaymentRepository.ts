import { PaymentRecord } from "@/model/domain/types";
import { adminDb } from "./admin";

export class FirestorePaymentRepository {
  private collection() {
    return adminDb.collection("payments");
  }

  async listRecent(limitCount = 20): Promise<PaymentRecord[]> {
    const snap = await this.collection().orderBy("createdAt", "desc").limit(limitCount).get();
    return snap.docs.map((doc) => doc.data() as PaymentRecord);
  }

  async recordPayment(payment: PaymentRecord): Promise<PaymentRecord> {
    await this.collection().doc(payment.id).set(payment);
    return payment;
  }
}
