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
    andFilter: {
      status: 'active',
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
    return results.data; //return data only - exclude count
  } catch (error) {
    console.log('error calling api ', error);
    throw error;
  }
}

export async function GetLookupStores() {
  const apiProps: FindAllProps = {
    andFilter: {
      status: 'active',
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
    return results.data; //return data only - exclude count
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
      isActive: true,
    };
  }

  if (group && !code) {
    andFilter = {
      lookupGroup: group,
      isActive: true,
    };
  }

  if (!group && code) {
    andFilter = {
      lookupCode: code,
      isActive: true,
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

  if (lookups) return lookups;
  return { count: 0, data: [] }; //catch all
}
