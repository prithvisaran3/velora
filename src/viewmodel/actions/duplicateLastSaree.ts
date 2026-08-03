"use server";

import { ActionResult } from "@/model/domain/types";
import { sareesFixture } from "@/model/fixtures/sarees";

export interface DuplicatedSareeDefaults {
  fabric: string;
  lengthCm: number;
  blousePieceCm: number;
  zari: string;
  care: string;
  weightGrams: number;
  occasions: string[];
  authenticityNote: string;
}

export async function duplicateLastSaree(): Promise<ActionResult<DuplicatedSareeDefaults>> {
  // Uses last saree defaults for 20-second admin product creation
  const last = sareesFixture[sareesFixture.length - 1];
  return {
    ok: true,
    data: {
      fabric: last.fabric,
      lengthCm: last.lengthCm,
      blousePieceCm: last.blousePieceCm,
      zari: last.zari,
      care: last.care,
      weightGrams: last.weightGrams,
      occasions: last.occasions,
      authenticityNote: last.authenticityNote,
    },
  };
}
