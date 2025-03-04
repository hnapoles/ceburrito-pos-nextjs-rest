import StoreUpdate from '@/app/features/stores/update/store-update';

import { apiClientDq } from '@/lib/fetch-helper';

import { StoreBase } from '@/app/models/stores-model';
import { ApiOperationNames, FindOneProps } from '@/app/models/api-model';

export default async function StoreUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const method = 'POST';
  const id = (await params).id;
  const entity = 'store';

  const store = await apiClientDq<StoreBase, FindOneProps>(
    entity,
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );

  return <StoreUpdate store={store} />;
}
