import { container } from "@/infrastructure/container";
import { Saree } from "@/model/domain/types";
import { configFixture } from "@/model/fixtures/config.fixture";

export interface HomeViewModel {
  /** Everything in stock. The grid filters and pages it — nothing is sliced
   *  to a fixed number here, because no number in the UI may depend on one. */
  sarees: Saree[];
  config: typeof configFixture;
}

export async function getHomeViewModel(): Promise<HomeViewModel> {
  const sarees = await container.sareeRepository.listAvailable();
  return { sarees, config: configFixture };
}
