import { container } from "@/infrastructure/container";
import { Saree } from "@/model/domain/types";
import { configFixture } from "@/model/fixtures/config.fixture";

export interface HomeViewModel {
  heroSaree: Saree;
  latestEdit: Saree[];
  config: typeof configFixture;
}

export async function getHomeViewModel(): Promise<HomeViewModel> {
  const sarees = await container.sareeRepository.listAvailable();
  return {
    heroSaree: sarees[0],
    latestEdit: sarees.slice(0, 8),
    config: configFixture,
  };
}
