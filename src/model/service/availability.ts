import { InventoryLock } from "../domain/types";

export const LOCK_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function createLock(sareeId: string, cartId: string): InventoryLock {
  const expiresAt = new Date(Date.now() + LOCK_TTL_MS).toISOString();
  return {
    sareeId,
    cartId,
    expiresAt,
  };
}

export function isLockExpired(lock: InventoryLock): boolean {
  return new Date(lock.expiresAt).getTime() < Date.now();
}
