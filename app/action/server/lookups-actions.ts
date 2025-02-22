'use server';

import { apiClientDq } from '@/lib/fetch-helper';

import { ProductData, IGetProductsResults } from '@/app/model/products-model';
import { ApiOperationNames, FindAll } from '@/app/model/api-model';

import { FindLookupOutput, OrderTypeProps } from '@/app/model/lookups-model';

import {
  CustomerData,
  IGetCustomersResults,
} from '@/app/model/customers-model';
import { IGetStoresResults } from '@/app/model/stores-model';

export async function GetLookupsOrderTypes() {
  const lookups = await apiClientDq<FindLookupOutput, FindAll>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: OrderTypeProps },
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

export async function GetLookupStores(
  keyword: string | '',
  page: string | '1',
  limit: string | '99999',
) {
  const apiProps: FindAll = {
    entity: 'store',
    keyword: keyword,
    searchKeywordFields: ['name'],
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    const results = await apiClientDq<IGetStoresResults, FindAll>(
      'store',
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

export async function GetLookups(group: string | null, code: string | null) {
  let andFilter = {};
  if (group && code) {
    andFilter = {
      lookupGroup: group,
      lookupCode: code,
    };
  }

  if (group && !code) {
    andFilter = {
      lookupGroup: group,
    };
  }

  if (!group && code) {
    andFilter = {
      lookupCode: code,
    };
  }

  const lookupProps = {
    andFilter: andFilter,
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

  const lookups = await apiClientDq<FindLookupOutput, FindAll>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: lookupProps },
  );

  return lookups;
}
