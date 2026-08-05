/**
 * Scene registration + disposal for the one shared canvas.
 *
 * A "view" is a THREE.Scene plus a camera, scissored into the screen rect of a
 * DOM element. The renderer in CanvasProvider walks this registry once per
 * frame. Registration is imperative on purpose: a scene appearing or leaving
 * must not re-render the React tree that owns the canvas.
 */

import { useEffect } from "react";
import * as THREE from "three";

export interface SceneRegistration {
  /** The DOM element whose box the scene is drawn into. */
  el: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  /** Lower draws first. Overlays (the bag flight) sit above page scenes. */
  order: number;
  /**
   * Pixels to clip off the top of the rect, so a scene never paints under the
   * sticky header. The camera compensates with setViewOffset, so clipping
   * crops — it never squashes.
   */
  clipTop?: () => number;
  /** Skip the view entirely this frame without unmounting it. */
  enabled?: () => boolean;
}

const views: SceneRegistration[] = [];

export function registerView(view: SceneRegistration): () => void {
  views.push(view);
  views.sort((a, b) => a.order - b.order);
  return () => {
    const i = views.indexOf(view);
    if (i !== -1) views.splice(i, 1);
  };
}

export function getViews(): readonly SceneRegistration[] {
  return views;
}

/** True when at least one registered view wants to draw. */
export function hasActiveViews(): boolean {
  return views.some((v) => v.enabled?.() !== false);
}

function disposeMaterial(material: THREE.Material): void {
  const record = material as unknown as Record<string, unknown>;
  const seen = new Set<unknown>();
  const release = (value: unknown): void => {
    if (!(value instanceof THREE.Texture) || seen.has(value)) return;
    seen.add(value);
    // Module-level singletons (the blank zari mask) outlive any one scene.
    if (value.userData.shared === true) return;
    value.dispose();
  };
  for (const value of Object.values(record)) {
    release(value);
    // ShaderMaterial keeps its textures one level down, inside uniforms.
    if (value && typeof value === "object" && !(value instanceof THREE.Texture)) {
      for (const uniform of Object.values(value as Record<string, unknown>)) {
        if (uniform && typeof uniform === "object" && "value" in uniform) {
          release((uniform as { value: unknown }).value);
        }
      }
    }
  }
  material.dispose();
}

/**
 * Release every GPU resource a scene owns. Called on unmount so twenty route
 * changes leak nothing — the context itself is never recreated, only its
 * contents.
 */
export function disposeScene(scene: THREE.Scene): void {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach(disposeMaterial);
    else if (material) disposeMaterial(material);
  });
  scene.clear();
}

/** Dispose an arbitrary bag of resources when a scene unmounts. */
export function useDisposable(
  factory: () => { dispose(): void } | null,
  deps: readonly unknown[]
): void {
  useEffect(() => {
    const resource = factory();
    return () => resource?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
