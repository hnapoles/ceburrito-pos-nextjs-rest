'use server';

import { apiClientDq } from '@/lib/fetch-helper';

import { ApiOperationNames, FindAllProps } from '@/app/models/api-model';

import {
  FindLookupOutput,
  LookupOrderTypeProps,
} from '@/app/models/lookups-model';

import { FindCustomersOutput } from '@/app/models/customers-model';
import { IGetStoresResults } from '@/app/models/stores-model';

export async function GetLookupsOrderTypes() {
  const lookups = await apiClientDq<FindLookupOutput, FindAllProps>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: LookupOrderTypeProps },
  );
  return lookups;
}

export async function GetLookupCustomers() {
  const apiProps: FindAllProps = {
    entity: 'customer',
    //keyword: keyword,
    //searchKeywordFields: ['name'],
    andFilter: {
      staus: 'active',
    },
    page: 1,
    limit: 99999,
  };

  try {
    const results = await apiClientDq<FindCustomersOutput, FindAllProps>(
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

export async function GetLookupStores() {
  const apiProps: FindAllProps = {
    entity: 'store',
    //keyword: keyword,
    //searchKeywordFields: ['name'],
    andFilter: {
      staus: 'active',
    },
    page: 1,
    limit: 99999,
  };

  try {
    const results = await apiClientDq<IGetStoresResults, FindAllProps>(
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

  const lookups = await apiClientDq<FindLookupOutput, FindAllProps>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: lookupProps },
  );

  return lookups;
}
