'use server';

import { apiClientDq } from '@/lib/fetch-helper';

import { ProductData, IGetProductsResults } from '@/app/model/products-model';
import { ApiOperationNames, FindAll } from '@/app/model/api-model';

import { LookupQueryResults } from '@/app/model/lookups-model';

import {
  CustomerData,
  IGetCustomersResults,
} from '@/app/model/customers-model';

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

export async function GetLookupsOrderTypes() {
  const lookups = await apiClientDq<LookupQueryResults, FindAll>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: OrderTypeFilter },
  );
  return lookups;
}

export async function GetLookupCustomers(
  keyword: string | '',
  page: string | '1',
  limit: string | '99999',
) {
  const apiProps: FindAll = {
    entity: 'customer',
    keyword: keyword,
    searchKeywordFields: ['name'],
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    const results = await apiClientDq<IGetCustomersResults, FindAll>(
      'customer',
      ApiOperationNames.FindAll,
      '',
      { method: 'POST', body: apiProps },
    );
    return results;
  } catch (error) {
    console.log('error calling api ', error);
    throw error;
  }
}
