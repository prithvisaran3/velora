"use server";

import { sareeInputSchema } from "@/model/schema/saree.schema";
import { ActionResult, Saree, paise } from "@/model/domain/types";
import { adminDb } from "@/infrastructure/firebase/admin";
import { configFixture } from "@/model/fixtures/config.fixture";

export async function upsertSaree(input: unknown): Promise<ActionResult<Saree>> {
  const parsed = sareeInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: parsed.error.issues.map((i) => i.message).join(", "),
      },
    };
  }

  const data = parsed.data;
  const id = `vlr-${Date.now()}`;
  const slug = `${data.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id.slice(-4)}`;

  const colourConfig = configFixture.colours[data.colourKey];

  const newSaree: Saree = {
    id,
    slug,
    title: { en: data.titleEn, ta: data.titleTa },
    priceInPaise: paise(300000),
    status: data.status,
    colour: {
      key: data.colourKey,
      label: colourConfig ? colourConfig.label : { en: data.colourKey, ta: data.colourKey },
      hex: colourConfig ? colourConfig.hex : "#8C1F3D",
    },
    occasions: data.occasions,
    fabric: data.fabric,
    lengthCm: data.lengthCm,
    blousePieceCm: data.blousePieceCm,
    zari: data.zari,
    care: data.care,
    weightGrams: data.weightGrams,
    images: data.images,
    authenticityNote: data.authenticityNote,
    curatorNote: data.curatorNote || undefined,
    publishedAt: data.status === "available" ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await adminDb.collection("sarees").doc(id).set(newSaree);

  return { ok: true, data: newSaree };
}
