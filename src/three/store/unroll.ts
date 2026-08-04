/**
 * Scroll progress for the pallu unroll, 0…1.
 *
 * A module-level float rather than React state: ScrollTrigger writes it up to
 * sixty times a second and the scene reads it in useFrame. Putting that
 * through a re-render would cost more than the scene does.
 */

let progress = 0;

export function setUnrollProgress(value: number): void {
  progress = value < 0 ? 0 : value > 1 ? 1 : value;
}

export function getUnrollProgress(): number {
  return progress;
}
