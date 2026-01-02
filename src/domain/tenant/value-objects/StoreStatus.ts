/**
 * StoreStatus
 * -----------
 * V1: ACTIVE / ARCHIVED
 */
export const STORE_STATUS = ['ACTIVE', 'ARCHIVED'] as const;
export type StoreStatus = (typeof STORE_STATUS)[number];

export function parseStoreStatus(raw: string): StoreStatus {
  if ((STORE_STATUS as readonly string[]).includes(raw)) return raw as StoreStatus;
  // fallback safe (ou throw si tu préfères strict)
  return 'ACTIVE';
}
