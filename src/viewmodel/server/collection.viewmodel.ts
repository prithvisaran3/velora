import { container } from "@/infrastructure/container";
import { Saree, ColourKey, OccasionKey } from "@/model/domain/types";
import { configFixture } from "@/model/fixtures/config.fixture";

export interface ColourCollectionVM {
  colourKey: ColourKey;
  colourData: { hex: string; label: { en: string; ta: string } };
  sarees: Saree[];
  config: typeof configFixture;
}

export interface OccasionCollectionVM {
  occasionKey: OccasionKey;
  occasionData: { title: { en: string; ta: string }; description: { en: string; ta: string } };
  sarees: Saree[];
  config: typeof configFixture;
}

export async function getColourCollectionVM(colourKey: ColourKey): Promise<ColourCollectionVM> {
  const sarees = await container.sareeRepository.listByColour(colourKey);
  return {
    colourKey,
    colourData: configFixture.colours[colourKey] || configFixture.colours.maroon,
    sarees,
    config: configFixture,
  };
}

export async function getOccasionCollectionVM(occasionKey: OccasionKey): Promise<OccasionCollectionVM> {
  const sarees = await container.sareeRepository.listByOccasion(occasionKey);
  return {
    occasionKey,
    occasionData: configFixture.occasions[occasionKey] || configFixture.occasions.muhurtham,
    sarees,
    config: configFixture,
  };
}
