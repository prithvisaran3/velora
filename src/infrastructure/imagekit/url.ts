const IMAGEKIT_ENDPOINT =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/velora";

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  blur?: number;
  format?: "auto" | "webp" | "avif";
  crop?: "maintain_ratio" | "force";
}

export function buildImageKitUrl(path: string, options: ImageTransformOptions = {}): string {
  if (!path) return "/brand/png/icon-flat-512.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const transforms: string[] = [];

  if (options.width) transforms.push(`w-${options.width}`);
  if (options.height) transforms.push(`h-${options.height}`);
  if (options.quality) transforms.push(`q-${options.quality}`);
  if (options.blur) transforms.push(`bl-${options.blur}`);

  transforms.push(`f-${options.format || "auto"}`);

  const transformString = transforms.length > 0 ? `tr:${transforms.join(",")}` : "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${IMAGEKIT_ENDPOINT}${transformString ? `/${transformString}` : ""}${cleanPath}`;
}

export function generateSrcSet(path: string, widths = [390, 540, 768, 1080, 1440]): string {
  return widths
    .map((w) => `${buildImageKitUrl(path, { width: w, quality: 78 })} ${w}w`)
    .join(", ");
}

export function getBlurPlaceholder(path: string): string {
  return buildImageKitUrl(path, { width: 20, quality: 20, blur: 10 });
}
