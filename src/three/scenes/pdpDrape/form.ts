/**
 * The drape form and the cloth on it.
 *
 * Deviation from P2, deliberate: the spec calls for a shared GLB of ≤400 KB.
 * There is no such asset in the repo and the brief for it is "an abstract
 * mannequin, no character detail" — which is a lathe of eleven points. Built
 * here it costs 0 KB on the wire instead of 400, decodes in under a
 * millisecond, and takes the saree hue without a texture set. Swap it for a
 * GLB the day real scan data exists; the scene reads either.
 */

import * as THREE from "three";

/**
 * Dress-form silhouette, bottom to top, in (radius, height).
 *
 * It ends in a flat-cut neck, not a head: the moment the top domes over, the
 * eye reads a person and starts judging a face that is not there.
 */
const PROFILE: readonly [number, number][] = [
  [0.02, -1.62],
  [0.32, -1.62],
  [0.34, -1.57],
  [0.07, -1.5],
  [0.07, -1.12],
  [0.44, -1.02],
  [0.55, -0.78],
  [0.52, -0.46],
  [0.41, -0.2],
  [0.47, 0.06],
  [0.53, 0.26],
  [0.48, 0.46],
  [0.38, 0.57],
  [0.21, 0.63],
  [0.13, 0.65],
  [0.12, 0.78],
  [0.0, 0.78],
];

export function createStandGeometry(): THREE.LatheGeometry {
  const points = PROFILE.map(([r, y]) => new THREE.Vector2(r, y));
  const geometry = new THREE.LatheGeometry(points, 56);
  geometry.computeVertexNormals();
  return geometry;
}

/** Body radius at a height, read off the same profile the lathe uses. */
function radiusAt(y: number): number {
  if (y <= PROFILE[0][1]) return PROFILE[0][0];
  for (let i = 1; i < PROFILE.length; i += 1) {
    const [r0, y0] = PROFILE[i - 1];
    const [r1, y1] = PROFILE[i];
    if (y <= y1) {
      const t = (y - y0) / (y1 - y0 || 1);
      return r0 + (r1 - r0) * t;
    }
  }
  return PROFILE[PROFILE.length - 1][0];
}

type SurfaceFn = (u: number, v: number, target: THREE.Vector3) => void;

/** A parametric grid with clean UVs — three's ParametricGeometry, minus the import. */
function parametricSurface(
  slices: number,
  stacks: number,
  fn: SurfaceFn,
  uRepeat = 1
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const point = new THREE.Vector3();

  for (let i = 0; i <= slices; i += 1) {
    const u = i / slices;
    for (let j = 0; j <= stacks; j += 1) {
      const v = j / stacks;
      fn(u, v, point);
      positions.push(point.x, point.y, point.z);
      uvs.push(u * uRepeat, v);
    }
  }

  const row = stacks + 1;
  for (let i = 0; i < slices; i += 1) {
    for (let j = 0; j < stacks; j += 1) {
      const a = i * row + j;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

const SKIRT_TOP = -0.04;
const SKIRT_BOTTOM = -1.56;
/** Below the hip the form narrows to its pole; the cloth must not follow it. */
const HIP_Y = -1.0;

/**
 * The lower drape: the saree wrapped twice round the form, pleated at the
 * front and flaring toward the hem. u runs the length of the cloth (so the
 * pallu end of the mask lands at the shoulder), v runs its width, which puts
 * a selvedge at the waist and a selvedge at the hem — as it falls in life.
 */
export function createSkirtGeometry(): THREE.BufferGeometry {
  return parametricSurface(
    128,
    28,
    (u, v, target) => {
      const theta = u * Math.PI * 2;
      const y = SKIRT_TOP + (SKIRT_BOTTOM - SKIRT_TOP) * v;
      const flare = 1 + 0.24 * v * v;
      // Knife pleats gather at the front and relax round the back.
      const front = Math.max(0, Math.cos(theta - Math.PI / 2));
      const pleat =
        0.03 * Math.sin(theta * 11 + v * 1.1) * (0.35 + 0.65 * front) * (0.4 + v);
      // Hanging free below the hip — following radiusAt() down to the pole is
      // what made the skirt pinch in and read as a lampshade.
      const support = y < HIP_Y ? radiusAt(HIP_Y) : radiusAt(y);
      const radius = (support + 0.035) * flare + pleat;
      target.set(radius * Math.cos(theta), y, radius * Math.sin(theta));
    },
    2
  );
}

/**
 * The blouse. Without it the bare form reads through the drape as a dark
 * torso and the eye goes straight to the mannequin instead of the cloth.
 * Plain weave, no pleats — a blouse is cut, not draped.
 */
export function createBlouseGeometry(): THREE.BufferGeometry {
  const top = 0.6;
  const bottom = -0.06;
  return parametricSurface(96, 16, (u, v, target) => {
    const theta = u * Math.PI * 2;
    const y = top + (bottom - top) * v;
    const radius = radiusAt(y) + 0.026;
    target.set(radius * Math.cos(theta), y, radius * Math.sin(theta));
  });
}

/**
 * The pallu: off the left shoulder, across the back and forward again, with
 * two soft folds down its length. A cubic path through four points, given
 * width along the body's tangent.
 */
export function createPalluGeometry(): THREE.BufferGeometry {
  const spine = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.34, 0.62, 0.06),
    new THREE.Vector3(-0.58, 0.24, -0.2),
    new THREE.Vector3(-0.6, -0.34, -0.05),
    new THREE.Vector3(-0.44, -0.92, 0.28),
    new THREE.Vector3(-0.3, -1.34, 0.46),
  ]);

  const tangent = new THREE.Vector3();
  const point = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const side = new THREE.Vector3();

  return parametricSurface(64, 12, (u, v, target) => {
    spine.getPointAt(u, point);
    spine.getTangentAt(u, tangent);
    side.crossVectors(tangent, up).normalize();
    if (side.lengthSq() < 1e-6) side.set(1, 0, 0);

    const halfWidth = 0.3 + 0.1 * u;
    const across = (v - 0.5) * 2;
    // Two folds, deepening as the cloth leaves the shoulder.
    const fold = Math.sin(across * Math.PI * 2) * 0.055 * (0.3 + u);

    target
      .copy(point)
      .addScaledVector(side, across * halfWidth)
      .addScaledVector(up, fold * 0.4);
    target.z += fold;
  });
}
