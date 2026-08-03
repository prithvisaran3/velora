import { Offer, paise } from "@/model/domain/types";
import { adminDb } from "./admin";

export class FirestoreOfferRepository {
  private collection() {
    return adminDb.collection("offers");
  }

  async listActive(): Promise<Offer[]> {
    const snap = await this.collection().where("isActive", "==", true).get();
    return snap.docs.map((doc) => doc.data() as Offer);
  }

  async listAll(): Promise<Offer[]> {
    const snap = await this.collection().get();
    return snap.docs.map((doc) => doc.data() as Offer);
  }

  async getByCode(code: string): Promise<Offer | null> {
    const snap = await this.collection().where("code", "==", code.toUpperCase()).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as Offer;
  }

  async saveOffer(offer: Offer): Promise<Offer> {
    await this.collection().doc(offer.id).set(offer);
    return offer;
  }
}
