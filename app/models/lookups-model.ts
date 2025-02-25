export interface Lookup {
  _id?: string;
  lookupCode: string;
  lookupDescription: string;
  lookupGroup: string;
  lookupValue: string;
  sortSeq?: number;
}

export const DefaultSizeOptions: Lookup[] = [
  {
    _id: '1',
    lookupCode: 'sizeOption',
    lookupDescription: 'Small',
    lookupGroup: 'order',
    lookupValue: 'S',
    sortSeq: 1,
  },
  {
    _id: '2',
    lookupCode: 'sizeOption',
    lookupDescription: 'Medium',
    lookupGroup: 'order',
    lookupValue: 'M',
    sortSeq: 2,
  },
  {
    _id: '3',
    lookupCode: 'sizeOption',
    lookupDescription: 'Large',
    lookupGroup: 'order',
    lookupValue: 'L',
    sortSeq: 3,
  },
  {
    _id: '4',
    lookupCode: 'sizeOption',
    lookupDescription: 'Xtra Large',
    lookupGroup: 'order',
    lookupValue: 'XL',
    sortSeq: 4,
  },
];

export const DefaultSpiceOptions: Lookup[] = [
  {
    _id: '1',
    lookupCode: 'spiceOption',
    lookupDescription: 'Mild',
    lookupGroup: 'order',
    lookupValue: 'Mild',
    sortSeq: 1,
  },
  {
    _id: '2',
    lookupCode: 'spiceOption',
    lookupDescription: 'Medium',
    lookupGroup: 'order',
    lookupValue: 'Medium',
    sortSeq: 2,
  },
  {
    _id: '3',
    lookupCode: 'spiceOption',
    lookupDescription: 'Spicy',
    lookupGroup: 'order',
    lookupValue: 'Spicy',
    sortSeq: 3,
  },
  {
    _id: '4',
    lookupCode: 'spiceOption',
    lookupDescription: 'Extra Spicy',
    lookupGroup: 'order',
    lookupValue: 'Extra Spicy',
    sortSeq: 4,
  },
];

export interface FindLookupOutput {
  count: number;
  data: Lookup[];
}

export const LookupProductCategoryProps = {
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

export const LookupProductTypeProps = {
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

export const LookupOrderTypeProps = {
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
