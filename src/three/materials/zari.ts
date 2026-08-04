/**
 * Zari masks, drawn at runtime on a 2D canvas.
 *
 * Priya has not supplied weave crops yet (design/Velora Website v2 · "WHAT
 * PRIYA MUST SUPPLY"), and a mask is a layout, not a photograph — so it is
 * generated. Cost on the wire: zero bytes, for every saree and every hue.
 * Swap `createZariMask` for a KTX2 load the day the real crops land.
 *
 * Red channel only: 1 = zari thread, 0 = ground cloth.
 */

import * as THREE from "three";

export interface ZariMaskOptions {
  /** Width of each side border as a fraction of the cloth. */
  border?: number;
  /** Height of the pallu block at the foot of the cloth. */
  pallu?: number;
  buttaRows?: number;
  buttaColumns?: number;
  size?: number;
}

function mangai(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number
): void {
  // The mangai (paisley) motif from a South Indian border, reduced to one
  // teardrop with a curled tip.
  ctx.beginPath();
  ctx.moveTo(x, y - scale);
  ctx.bezierCurveTo(x + scale * 0.92, y - scale * 0.5, x + scale * 0.72, y + scale * 0.72, x, y + scale);
  ctx.bezierCurveTo(x - scale * 0.72, y + scale * 0.72, x - scale * 0.92, y - scale * 0.5, x, y - scale);
  ctx.closePath();
  ctx.fill();
}

function butta(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number
): void {
  ctx.beginPath();
  ctx.moveTo(x, y - scale);
  ctx.lineTo(x + scale * 0.62, y);
  ctx.lineTo(x, y + scale);
  ctx.lineTo(x - scale * 0.62, y);
  ctx.closePath();
  ctx.fill();
}

function templeEdge(
  ctx: CanvasRenderingContext2D,
  x: number,
  width: number,
  height: number,
  teeth: number,
  pointRight: boolean
): void {
  const step = height / teeth;
  for (let i = 0; i < teeth; i += 1) {
    const top = i * step;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x + (pointRight ? width : -width), top + step * 0.5);
    ctx.lineTo(x, top + step);
    ctx.closePath();
    ctx.fill();
  }
}

export function createZariMask(options: ZariMaskOptions = {}): THREE.CanvasTexture {
  const size = options.size ?? 512;
  const border = options.border ?? 0.075;
  const pallu = options.pallu ?? 0.19;
  const rows = options.buttaRows ?? 7;
  const columns = options.buttaColumns ?? 4;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable for the zari mask");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#fff";

  const borderPx = size * border;

  // Two selvedge borders, each a solid band with a temple edge facing the body.
  ctx.fillRect(0, 0, borderPx, size);
  ctx.fillRect(size - borderPx, 0, borderPx, size);
  templeEdge(ctx, borderPx, borderPx * 0.42, size, 30, true);
  templeEdge(ctx, size - borderPx, borderPx * 0.42, size, 30, false);

  // A hairline of ground inside each border keeps the band from reading solid.
  ctx.fillStyle = "#000";
  ctx.fillRect(borderPx * 0.62, 0, borderPx * 0.1, size);
  ctx.fillRect(size - borderPx * 0.72, 0, borderPx * 0.1, size);
  ctx.fillStyle = "#fff";

  // Pallu: dense zari at the foot, with a row of mangai above it.
  const palluPx = size * pallu;
  ctx.fillRect(0, size - palluPx, size, palluPx * 0.52);
  for (let i = 0; i < 9; i += 1) {
    const x = ((i + 0.5) / 9) * size;
    mangai(ctx, x, size - palluPx * 0.24, palluPx * 0.2);
  }
  ctx.fillRect(0, size - palluPx * 0.06, size, palluPx * 0.06);

  // Body buttas, offset row to row like a real handloom lay-out.
  const bodyTop = size * 0.04;
  const bodyHeight = size - palluPx - bodyTop;
  for (let r = 0; r < rows; r += 1) {
    const y = bodyTop + ((r + 0.5) / rows) * bodyHeight;
    const offset = r % 2 === 0 ? 0 : 0.5;
    for (let c = 0; c < columns; c += 1) {
      const u = (c + 0.5 + offset) / columns;
      if (u < border * 1.5 || u > 1 - border * 1.5) continue;
      butta(ctx, u * size, y, size * 0.018);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.NoColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/**
 * A long strip mask for the pallu unroll: body, then a four-inch border, then
 * the mangai pallu — read left to right as the roll opens.
 */
export function createPalluStripMask(size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = Math.round(size / 4);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable for the pallu mask");

  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";

  // Selvedge runs the whole length, top and bottom.
  const selvedge = h * 0.085;
  ctx.fillRect(0, 0, w, selvedge);
  ctx.fillRect(0, h - selvedge, w, selvedge);

  // Body buttas over the first 55% of the length.
  for (let r = 0; r < 4; r += 1) {
    const y = selvedge + ((r + 0.5) / 4) * (h - selvedge * 2);
    for (let c = 0; c < 16; c += 1) {
      const x = ((c + (r % 2 ? 0.5 : 0)) / 16) * w * 0.55;
      if (x < w * 0.02) continue;
      butta(ctx, x, y, h * 0.032);
    }
  }

  // The four-inch border: a solid band across the width at 55–72%.
  ctx.fillRect(w * 0.55, 0, w * 0.02, h);
  ctx.fillRect(w * 0.7, 0, w * 0.02, h);
  templeEdge(ctx, w * 0.57, w * 0.014, h, 12, true);

  // Mangai pallu closes the run.
  ctx.fillRect(w * 0.74, 0, w * 0.26, selvedge * 1.4);
  ctx.fillRect(w * 0.74, h - selvedge * 1.4, w * 0.26, selvedge * 1.4);
  for (let i = 0; i < 5; i += 1) {
    const x = w * 0.77 + (i / 5) * w * 0.21;
    mangai(ctx, x, h * 0.5, h * 0.26);
  }
  ctx.fillRect(w * 0.985, 0, w * 0.015, h);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

let blank: THREE.DataTexture | null = null;

/** A 1×1 black mask, so the sampler is always bound even with no zari. */
export function blankMask(): THREE.DataTexture {
  if (!blank) {
    blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    blank.colorSpace = THREE.NoColorSpace;
    blank.userData.shared = true;
    blank.needsUpdate = true;
  }
  return blank;
}
