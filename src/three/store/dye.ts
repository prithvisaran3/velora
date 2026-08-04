/**
 * The dye (moment 03).
 *
 * A channel owns one colour and lerps it over 800ms. The colour page keeps a
 * single channel alive across every /colour/[slug] navigation, so choosing a
 * hue re-tints the *same* mesh — no re-mount, no texture upload, zero bytes
 * between colours. Zari is not part of the channel and never moves, which is
 * the whole trick: gold staying put is what makes the rest read as dye taking
 * to cloth rather than a div changing colour.
 */

import * as THREE from "three";
import { DURATION } from "@/lib/motion";
import { easeSilk } from "../ease";

const DYE_MS = DURATION.dye * 1000;

export class DyeChannel {
  private readonly from: THREE.Color;
  private readonly to: THREE.Color;
  private readonly current: THREE.Color;
  private startedAt = -1;
  private targetHex: string;

  constructor(hex: string) {
    this.targetHex = hex;
    this.from = new THREE.Color(hex);
    this.to = new THREE.Color(hex);
    this.current = new THREE.Color(hex);
  }

  /** Start a dye. A no-op if the cloth is already that hue. */
  set(hex: string): void {
    if (hex.toLowerCase() === this.targetHex.toLowerCase()) return;
    this.targetHex = hex;
    this.from.copy(this.current);
    this.to.set(hex);
    this.startedAt = performance.now();
  }

  /** Jump without animating — used when a scene mounts already on a hue. */
  prime(hex: string): void {
    this.targetHex = hex;
    this.from.set(hex);
    this.to.set(hex);
    this.current.set(hex);
    this.startedAt = -1;
  }

  /** Advance. Returns true while the colour is still moving. */
  tick(now: number): boolean {
    if (this.startedAt < 0) return false;
    const t = (now - this.startedAt) / DYE_MS;
    if (t >= 1) {
      this.current.copy(this.to);
      this.startedAt = -1;
      return true;
    }
    this.current.copy(this.from).lerp(this.to, easeSilk(t));
    return true;
  }

  colour(): THREE.Color {
    return this.current;
  }

  hex(): string {
    return this.targetHex;
  }
}
