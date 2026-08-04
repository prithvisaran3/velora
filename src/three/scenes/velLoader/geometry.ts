/**
 * The vel mark as solid geometry.
 *
 * The three contours are the ones in docs/BRAND.md, transcribed — not
 * redrawn. SVG space (120 × 100, y down) maps to object space by
 * x → (x − 60) / 50, y → (50 − y) / 50, so the mark spans ±1.12 × ±1.0 and
 * the extrusion depth of 12 SVG units becomes 0.24.
 */

import * as THREE from "three";

const SCALE = 1 / 50;
const X0 = 60;
const Y0 = 50;

const px = (x: number) => (x - X0) * SCALE;
const py = (y: number) => (Y0 - y) * SCALE;

/** blade — M4 0 C 24 22 46 58 60 100 C 74 58 96 22 116 0 L 86 0 C 74 22 65 50 60 72 C 55 50 46 22 34 0 Z */
function bladeShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(px(4), py(0));
  shape.bezierCurveTo(px(24), py(22), px(46), py(58), px(60), py(100));
  shape.bezierCurveTo(px(74), py(58), px(96), py(22), px(116), py(0));
  shape.lineTo(px(86), py(0));
  shape.bezierCurveTo(px(74), py(22), px(65), py(50), px(60), py(72));
  shape.bezierCurveTo(px(55), py(50), px(46), py(22), px(34), py(0));
  shape.closePath();
  return shape;
}

/** spine — M60 6 L65 14 L60 66 L55 14 Z (floats in the blade's counter) */
function spineShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(px(60), py(6));
  shape.lineTo(px(65), py(14));
  shape.lineTo(px(60), py(66));
  shape.lineTo(px(55), py(14));
  shape.closePath();
  return shape;
}

/** collar — M45 82 L75 82 L75 89 L45 89 Z (crossbar at the tip) */
function collarShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(px(45), py(82));
  shape.lineTo(px(75), py(82));
  shape.lineTo(px(75), py(89));
  shape.lineTo(px(45), py(89));
  shape.closePath();
  return shape;
}

function extrude(shape: THREE.Shape, depth: number): THREE.ExtrudeGeometry {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.026,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 22,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

export interface VelGeometry {
  blade: THREE.ExtrudeGeometry;
  spine: THREE.ExtrudeGeometry;
  collar: THREE.ExtrudeGeometry;
  dispose(): void;
}

export function createVelGeometry(): VelGeometry {
  const blade = extrude(bladeShape(), 0.24);
  // Spine and collar stand 0.02 proud of each blade face so the marigold
  // never z-fights the saffron where the two overlap at the tip.
  const spine = extrude(spineShape(), 0.28);
  const collar = extrude(collarShape(), 0.28);

  return {
    blade,
    spine,
    collar,
    dispose() {
      blade.dispose();
      spine.dispose();
      collar.dispose();
    },
  };
}
