import { Saree } from "./types";
import { Money } from "./money";

export function toEmbeddingText(saree: Saree): string {
  const priceStr = Money.formatRupees(saree.priceInPaise);
  const lengthMeters = (saree.lengthCm / 100).toFixed(1);
  const occasionsStr = saree.occasions.join(", ");
  
  return `${saree.title.en} (${saree.colour.label.en}). ${saree.fabric}, ${saree.zari}. ${lengthMeters} meters with attached blouse piece. ${saree.care}, ${saree.weightGrams}g. Perfect for ${occasionsStr}. Price: ${priceStr}. Handpicked by Bharani Pattu Centre, Erode since 1978. ${saree.authenticityNote}`;
}
