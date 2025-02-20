'use server';

import { apiClientDq } from '@/lib/fetch-helper';

import { ProductData, IGetProductsResults } from '@/app/model/products-model';
import { ApiOperationNames, FindAll } from '@/app/model/api-model';

import { LookupQueryResults } from '@/app/model/lookups-model';

const OrderTypeFilter = {
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

export async function GetLookupsOrderType() {
  const lookups = await apiClientDq<LookupQueryResults, FindAll>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: OrderTypeFilter },
  );
  return lookups;
}
