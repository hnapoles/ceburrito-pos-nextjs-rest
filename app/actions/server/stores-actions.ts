'use server';

import { apiClientDq } from '@/lib/fetch-helper';

import { StoreBase } from '@/app/models/stores-model';
import { ApiOperationNames } from '@/app/models/api-model';

export async function DeleteStoreById(id: string) {
  const entity = 'store';
  const operation = ApiOperationNames.Delete;
  const method = 'POST';

  const result = await apiClientDq<StoreBase, StoreBase>(
    entity,
    operation,
    id,
    { method: method },
  );

  return result;
}

export async function CreateStore(data: StoreBase) {
  const entity = 'store';
  const operation = ApiOperationNames.Create;
  const id = '';
  const method = 'POST';

  const result = await apiClientDq<StoreBase, StoreBase>(
    entity,
    operation,
    id,
    { method: method, body: data },
  );

  return result;
}

export async function UpdateStore(data: StoreBase) {
  const entity = 'store';
  const operation = ApiOperationNames.Update;
  const id = data._id;
  const method = 'POST';

  const result = await apiClientDq<StoreBase, StoreBase>(
    entity,
    operation,
    id,
    { method: method, body: data },
  );

  return result;
}
