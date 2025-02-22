export interface Lookup {
  _id?: string;
  lookupCode: string;
  lookupDescription: string;
  lookupGroup: string;
  lookupValue: string;
  sortSeq?: number;
}

export interface FindLookupOutput {
  count: number;
  data: Lookup[];
}

export const ProductCategoryProps = {
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

export const ProductTypeProps = {
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

export const OrderTypeProps = {
  andFilter: {
    lookupGroup: 'order',
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
