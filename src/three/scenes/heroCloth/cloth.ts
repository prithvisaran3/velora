/**
 * A verlet cloth, pinned along its top edge.
 *
 * Structural and shear constraints, two relaxation passes, gravity and a
 * little wind noise — the numbers are the ones in lib/motion CLOTH, and the
 * grid halves on the `mid` tier. Integration is normalised against a 60Hz
 * frame so a 120Hz laptop and a 30Hz phone settle in the same 1.4 seconds.
 *
 * No React, no three beyond BufferGeometry: this is the part that has to be
 * fast, so it works directly on the position attribute's Float32Array.
 */

import * as THREE from "three";
import { CLOTH } from "@/lib/motion";
import { clamp01, damp, easeSilk } from "../../ease";

const DAMPING = 0.982;
const DROP_HEIGHT = 1.2;
const DROP_MS = 620;

interface Constraint {
  a: number;
  b: number;
  rest: number;
}

export interface ClothOptions {
  width: number;
  height: number;
  segments: number;
}

export class ClothSolver {
  readonly geometry: THREE.PlaneGeometry;

  private readonly positions: Float32Array;
  private readonly previous: Float32Array;
  private readonly rest: Float32Array;
  private readonly constraints: Constraint[] = [];
  private readonly pins: number[] = [];
  private readonly columns: number;
  private readonly count: number;

  private elapsed = 0;
  private pointerTarget = 0;
  private pointerLift = 0;
  private pointerX = 0;

  constructor({ width, height, segments }: ClothOptions) {
    this.geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    this.columns = segments + 1;
    this.count = this.columns * this.columns;

    const attribute = this.geometry.attributes.position as THREE.BufferAttribute;
    this.positions = attribute.array as Float32Array;
    this.rest = Float32Array.from(this.positions);
    this.previous = Float32Array.from(this.positions);

    // Start the whole sheet above frame; the pins walk it down on mount.
    for (let i = 0; i < this.count; i += 1) {
      this.positions[i * 3 + 1] += DROP_HEIGHT;
      this.previous[i * 3 + 1] += DROP_HEIGHT;
    }

    for (let row = 0; row < this.columns; row += 1) {
      for (let col = 0; col < this.columns; col += 1) {
        const index = row * this.columns + col;
        if (row === 0) this.pins.push(index);
        if (col + 1 < this.columns) this.link(index, index + 1);
        if (row + 1 < this.columns) this.link(index, index + this.columns);
        // Shear: without it the sheet folds like paper, not like silk.
        if (col + 1 < this.columns && row + 1 < this.columns) {
          this.link(index, index + this.columns + 1);
          this.link(index + 1, index + this.columns);
        }
      }
    }
  }

  private link(a: number, b: number): void {
    const dx = this.rest[a * 3] - this.rest[b * 3];
    const dy = this.rest[a * 3 + 1] - this.rest[b * 3 + 1];
    const dz = this.rest[a * 3 + 2] - this.rest[b * 3 + 2];
    this.constraints.push({ a, b, rest: Math.hypot(dx, dy, dz) });
  }

  /** Pointer in view space, −1…1. Left of centre lifts the lower-left fall. */
  setPointer(x: number, y: number): void {
    this.pointerX = x;
    // Moving left lifts; being low in the frame adds a little on top of it.
    this.pointerTarget = clamp01(-x + Math.max(0, -y) * 0.2);
  }

  releasePointer(): void {
    this.pointerTarget = 0;
  }

  step(deltaMs: number): void {
    const dt = Math.min(Math.max(deltaMs, 6), 34);
    const scale = dt / 16.6667;
    this.elapsed += dt;

    this.pointerLift = damp(
      this.pointerLift,
      this.pointerTarget,
      CLOTH.pointerSmoothingMs,
      dt
    );

    const gravity = CLOTH.gravity * scale * scale;
    const windPhase = this.elapsed * 0.0016;
    const wind = CLOTH.wind * scale * scale;
    const push = this.pointerLift * CLOTH.pointerInfluence;

    for (let i = 0; i < this.count; i += 1) {
      const p = i * 3;
      const x = this.positions[p];
      const y = this.positions[p + 1];
      const z = this.positions[p + 2];

      // Wind is cheap pseudo-noise; two out-of-phase sines read as a breeze.
      const gust =
        Math.sin(windPhase + x * 1.7 + y * 0.9) *
        Math.cos(windPhase * 0.73 + y * 1.3);

      let ax = 0;
      let ay = -gravity;
      let az = gust * wind;

      if (push > 0.0001) {
        // Lower-left region only, with a soft falloff — the pallu lifts.
        const falloff = Math.max(0, 1 - Math.hypot(x + 1.6, y + 1.1) / 2.6);
        const region = falloff * falloff;
        if (region > 0) {
          const force = region * push * 0.012 * scale * scale;
          ay += force;
          az += force * 0.8;
          ax += force * 0.25 * (this.pointerX < 0 ? -1 : 1);
        }
      }

      this.positions[p] = x + (x - this.previous[p]) * DAMPING + ax;
      this.positions[p + 1] = y + (y - this.previous[p + 1]) * DAMPING + ay;
      this.positions[p + 2] = z + (z - this.previous[p + 2]) * DAMPING + az;

      this.previous[p] = x;
      this.previous[p + 1] = y;
      this.previous[p + 2] = z;
    }

    for (let pass = 0; pass < CLOTH.iterations; pass += 1) {
      this.relax();
      this.pin();
    }

    (this.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  private relax(): void {
    for (let c = 0; c < this.constraints.length; c += 1) {
      const { a, b, rest } = this.constraints[c];
      const pa = a * 3;
      const pb = b * 3;
      const dx = this.positions[pb] - this.positions[pa];
      const dy = this.positions[pb + 1] - this.positions[pa + 1];
      const dz = this.positions[pb + 2] - this.positions[pa + 2];
      const distance = Math.hypot(dx, dy, dz) || 1e-6;
      const correction = ((distance - rest) / distance) * 0.5;
      const cx = dx * correction;
      const cy = dy * correction;
      const cz = dz * correction;

      this.positions[pa] += cx;
      this.positions[pa + 1] += cy;
      this.positions[pa + 2] += cz;
      this.positions[pb] -= cx;
      this.positions[pb + 1] -= cy;
      this.positions[pb + 2] -= cz;
    }
  }

  /** The top edge is the only pinned row; it walks down over the drop. */
  private pin(): void {
    const drop = DROP_HEIGHT * (1 - easeSilk(clamp01(this.elapsed / DROP_MS)));
    for (let i = 0; i < this.pins.length; i += 1) {
      const p = this.pins[i] * 3;
      this.positions[p] = this.rest[p];
      this.positions[p + 1] = this.rest[p + 1] + drop;
      // A hair of slack across the rod, so the top is a hang and not a ruler.
      this.positions[p + 2] =
        this.rest[p + 2] + Math.sin((i / (this.pins.length - 1)) * Math.PI) * 0.06;
    }
  }

  dispose(): void {
    this.geometry.dispose();
  }
}
