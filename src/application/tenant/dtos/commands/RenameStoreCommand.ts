export type RenameStoreCommand = {
  storeId: string;
  name: string;
  idempotencyKey: string;
};
