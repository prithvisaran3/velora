import * as THREE from "three";
import { SILK } from "@/lib/motion";

/**
 * Anisotropic silk: sheen runs across the weft, zari threads (from a mask) read sharper
 * and stay gold through every dye colour — that is what makes it look like cloth.
 */
export function createSilkMaterial(opts: {
  hue: THREE.ColorRepresentation;      // saree colour from Firestore
  albedo?: THREE.Texture;
  zariMask?: THREE.Texture;
  normal?: THREE.Texture;
}) {
  const base = new THREE.Color(opts.hue);
  const sheen = base.clone().lerp(new THREE.Color("#ffffff"), SILK.sheenLighten);

  const mat = new THREE.MeshPhysicalMaterial({
    color: base,
    map: opts.albedo ?? null,
    normalMap: opts.normal ?? null,
    roughness: SILK.roughness,
    metalness: 0,
    sheen: 1,
    sheenColor: sheen,
    sheenRoughness: SILK.sheenRoughness,
    side: THREE.DoubleSide,
  });

  // zari: metallic gold wherever the mask is white, unaffected by the dye colour
  if (opts.zariMask) {
    mat.metalnessMap = opts.zariMask;
    mat.roughnessMap = opts.zariMask;
    mat.metalness = SILK.zari.metalness;
    mat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <metalnessmap_fragment>",
        `#include <metalnessmap_fragment>
         float zari = texture2D( metalnessMap, vMetalnessMapUv ).g;
         diffuseColor.rgb = mix( diffuseColor.rgb, vec3(0.847,0.663,0.235), zari );
         roughnessFactor = mix( roughnessFactor, ${SILK.zari.roughness}, zari );`
      );
    };
  }

  /** Dye: lerp colour + sheen over 800ms. Never touches the zari. */
  mat.userData.dyeTo = (hue: THREE.ColorRepresentation, t: number) => {
    const target = new THREE.Color(hue);
    mat.color.lerp(target, t);
    (mat.sheenColor as THREE.Color).lerp(target.clone().lerp(new THREE.Color("#ffffff"), SILK.sheenLighten), t);
  };

  return mat;
}
