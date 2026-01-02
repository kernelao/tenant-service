export type GetStoreResult = {
  storeId: string;
  name: string;
  status: 'ACTIVE' | 'ARCHIVED';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
