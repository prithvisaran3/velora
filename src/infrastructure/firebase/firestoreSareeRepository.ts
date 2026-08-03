import { SareeRepository } from "@/model/repository/sareeRepository";
import { Saree, ColourKey, OccasionKey } from "@/model/domain/types";
import { adminDb } from "./admin";
import { sareeConverter } from "./converters";

export class FirestoreSareeRepository implements SareeRepository {
  private collection() {
    return adminDb.collection("sarees").withConverter(sareeConverter as any);
  }

  async listAll(): Promise<Saree[]> {
    const snap = await this.collection().get();
    return snap.docs.map((doc) => doc.data() as Saree);
  }

  async listAvailable(): Promise<Saree[]> {
    const snap = await this.collection().where("status", "==", "available").get();
    return snap.docs.map((doc) => doc.data() as Saree);
  }

  async listByColour(colour: ColourKey): Promise<Saree[]> {
    const snap = await this.collection().where("colour.key", "==", colour).get();
    return snap.docs.map((doc) => doc.data() as Saree);
  }

  async listByOccasion(occasion: OccasionKey): Promise<Saree[]> {
    const snap = await this.collection().where("occasions", "array-contains", occasion).get();
    return snap.docs.map((doc) => doc.data() as Saree);
  }

  async listLatest(limitCount = 8): Promise<Saree[]> {
    const snap = await this.collection().where("status", "==", "available").limit(limitCount).get();
    return snap.docs.map((doc) => doc.data() as Saree);
  }

  async getBySlug(slug: string): Promise<Saree | null> {
    const snap = await this.collection().where("slug", "==", slug).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as Saree;
  }

  async getById(id: string): Promise<Saree | null> {
    const doc = await this.collection().doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as Saree;
  }

  async listRelated(sareeId: string, limitCount = 4): Promise<Saree[]> {
    const current = await this.getById(sareeId);
    if (!current) return this.listLatest(limitCount);

    const snap = await this.collection()
      .where("colour.key", "==", current.colour.key)
      .limit(limitCount + 1)
      .get();

    return snap.docs
      .map((doc) => doc.data() as Saree)
      .filter((s) => s.id !== sareeId)
      .slice(0, limitCount);
  }
}
