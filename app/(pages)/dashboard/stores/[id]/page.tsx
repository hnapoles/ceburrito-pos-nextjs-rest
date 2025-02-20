import StoreUpdate from '@/app/modules/stores/update/store-update';

import { apiClientDq } from '@/lib/fetch-helper';

import { StoreData } from '@/app/model/stores-model';
import { ApiOperationNames, FindOne } from '@/app/model/api-model';

export default async function StoreUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const method = 'POST';
  const id = (await params).id;
  const entity = 'store';

  const store = await apiClientDq<StoreData, FindOne>(
    entity,
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );

  return <StoreUpdate store={store} />;
}
