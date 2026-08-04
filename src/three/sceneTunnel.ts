/**
 * A one-way tunnel that lets a route render 3D children *into* the single
 * canvas that lives in the root layout, without the canvas ever unmounting.
 *
 * Thirty lines of pub/sub instead of a dependency: the canvas subscribes with
 * useSyncExternalStore, and route-level <SceneView> components publish a
 * descriptor into it. The snapshot identity only changes when a scene actually
 * changes, so the canvas re-renders exactly then.
 */

import { useSyncExternalStore } from "react";
import type { SceneDescriptor } from "./types";

let entries: readonly SceneDescriptor[] = [];
const subscribers = new Set<() => void>();
const EMPTY: readonly SceneDescriptor[] = [];

function emit(next: readonly SceneDescriptor[]): void {
  entries = next;
  subscribers.forEach((fn) => fn());
}

export function publishScene(descriptor: SceneDescriptor): void {
  const index = entries.findIndex((entry) => entry.id === descriptor.id);
  if (index === -1) {
    emit([...entries, descriptor]);
    return;
  }
  const next = entries.slice();
  next[index] = descriptor;
  emit(next);
}

export function retractScene(id: string): void {
  const next = entries.filter((entry) => entry.id !== id);
  if (next.length !== entries.length) emit(next);
}

function subscribe(fn: () => void): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export function useTunnelledScenes(): readonly SceneDescriptor[] {
  return useSyncExternalStore(
    subscribe,
    () => entries,
    () => EMPTY
  );
}
