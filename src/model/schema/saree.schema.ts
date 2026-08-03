import { z } from "zod";

export const sareeInputSchema = z.object({
  titleEn: z.string().min(3, "Title must be at least 3 characters"),
  titleTa: z.string().min(2, "Tamil title is required"),
  priceInRupees: z.number().int().positive("Price must be a positive integer"),
  colourKey: z.enum(["maroon", "peacock", "indigo", "leaf", "plum", "kora", "saffron", "marigold"]),
  occasions: z.array(z.enum(["muhurtham", "reception", "temple", "festival", "office", "everyday"])).min(1),
  fabric: z.string().min(2),
  lengthCm: z.number().int().positive().default(630),
  blousePieceCm: z.number().int().positive().default(80),
  zari: z.string().min(2),
  care: z.string().min(2),
  weightGrams: z.number().int().positive(),
  images: z.array(z.object({
    id: z.string(),
    alt: z.string().optional(),
    aspect: z.enum(["3/4", "1/1", "4/5", "16/9"]),
    order: z.number(),
  })).min(1),
  authenticityNote: z.string().min(5),
  curatorNote: z.string().optional(),
  status: z.enum(["draft", "available", "reserved", "sold"]).default("available"),
});

export type SareeInput = z.infer<typeof sareeInputSchema>;
