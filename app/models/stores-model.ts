import { z } from 'zod';

export interface IGetStoresResults {
  count: number;
  data: StoreBase[];
}

export interface IStoreListProps {
  stores: StoreBase[];
  limit: number | 10;
  page: number | 1;
  totalDataCount: number | 1;
}

export const StoreZodSchema = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(6, {
      message: 'Name must be at least 6 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  imageUrl: z.string().optional(),
  storeAddress: z.string().optional(),
  memberOfOrganizationName: z.string().optional(),
  memberOfOrganizationId: z.string().optional(),
  createdBy: z.string().optional(),
  createdAt: z.date().optional(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});

export type StoreBase = z.infer<typeof StoreZodSchema>;

export const ProductCategoryFilter = {
  andFilter: {
    lookupGroup: 'product',
    lookupCode: 'category',
  },
  limit: 999,
  page: 1,
  sortOptions: [
    {
      sortField: 'lookupCode',
      sortOrder: 1,
    },
    {
      sortField: 'lookupValue',
      sortOrder: 1,
    },
  ],
};

export const ProductTypeFilter = {
  andFilter: {
    lookupGroup: 'product',
    lookupCode: 'type',
  },
  limit: 999,
  page: 1,
  sortOptions: [
    {
      sortField: 'lookupCode',
      sortOrder: 1,
    },
    {
      sortField: 'lookupValue',
      sortOrder: 1,
    },
  ],
};
