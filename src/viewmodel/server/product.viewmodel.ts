import { container } from "@/infrastructure/container";
import { Saree } from "@/model/domain/types";
import { configFixture } from "@/model/fixtures/config.fixture";

export interface ProductViewModel {
  saree: Saree;
  relatedSarees: Saree[];
  config: typeof configFixture;
}

export async function getProductViewModel(slug: string): Promise<ProductViewModel | null> {
  const saree = await container.sareeRepository.getBySlug(slug);
  if (!saree) return null;

  const relatedSarees = await container.sareeRepository.listRelated(saree.id, 4);

  return {
    saree,
    relatedSarees,
    config: configFixture,
  };
}
