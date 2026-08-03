import { Saree, ColourKey, OccasionKey } from "../domain/types";

export interface SareeRepository {
  listAll(): Promise<Saree[]>;
  listAvailable(): Promise<Saree[]>;
  listByColour(colour: ColourKey): Promise<Saree[]>;
  listByOccasion(occasion: OccasionKey): Promise<Saree[]>;
  listLatest(limit?: number): Promise<Saree[]>;
  getBySlug(slug: string): Promise<Saree | null>;
  getById(id: string): Promise<Saree | null>;
  listRelated(sareeId: string, limit?: number): Promise<Saree[]>;
}
