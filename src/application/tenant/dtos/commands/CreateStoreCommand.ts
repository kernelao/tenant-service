export type CreateStoreCommand = {
  name: string;
  ownerId: string; // userId venant d’Identity (header/ctx)
  idempotencyKey: string;
};
