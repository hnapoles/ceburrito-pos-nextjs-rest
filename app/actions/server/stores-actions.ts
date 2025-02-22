'use server';

import { apiClientDq } from '@/lib/fetch-helper';

import { StoreData } from '@/app/models/stores-model';
import { ApiOperationNames } from '@/app/models/api-model';

export async function DeleteStoreById(id: string) {
  const entity = 'store';
  const operation = ApiOperationNames.Delete;
  const method = 'POST';

  const result = await apiClientDq<StoreData, StoreData>(
    entity,
    operation,
    id,
    { method: method },
  );

  return result;
}

export async function CreateStore(data: StoreData) {
  const entity = 'store';
  const operation = ApiOperationNames.Create;
  const id = '';
  const method = 'POST';

  const result = await apiClientDq<StoreData, StoreData>(
    entity,
    operation,
    id,
    { method: method, body: data },
  );

  return result;
}

export async function UpdateStore(data: StoreData) {
  const entity = 'store';
  const operation = ApiOperationNames.Update;
  const id = data._id;
  const method = 'POST';

  const result = await apiClientDq<StoreData, StoreData>(
    entity,
    operation,
    id,
    { method: method, body: data },
  );

  return result;
}
