export type ListStoresResult = {
  items: Array<{
    storeId: string;
    name: string;
    status: 'ACTIVE' | 'ARCHIVED';
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  nextCursor?: string;
};
