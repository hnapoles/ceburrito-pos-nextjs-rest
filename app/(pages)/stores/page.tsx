import { apiClientDq } from '@/lib/fetch-helper';

import { StoreBase, IGetStoresResults } from '@/app/models/stores-model';
import { ApiOperationNames, FindAllProps } from '@/app/models/api-model';

import StoresMainPage from '@/app/features/stores/list/stores-main-page';
import NotFound from './not-found';

export default async function Page(props: {
  searchParams: Promise<{ keyword: string; page: string; limit: string }>;
}) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? null;
  const limit = searchParams.limit ?? '10';
  const page = searchParams.page ?? '1';

  let stores: StoreBase[] = [];
  let totalStores = 0;

  const apiProps: FindAllProps = {
    entity: 'store',
    keyword: keyword,
    searchKeywordFields: ['name'],
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    const results = await apiClientDq<IGetStoresResults, FindAllProps>(
      'store',
      ApiOperationNames.FindAll,
      '',
      { method: 'POST', body: apiProps },
    );
    totalStores = results.count;
    stores = results.data;
  } catch (error) {
    console.log('error calling api ', error);
  }

  if (stores) {
    return (
      <StoresMainPage
        stores={stores}
        limit={parseInt(limit)}
        page={parseInt(page)}
        totalDataCount={totalStores}
      />
    );
  }

  if (!stores) {
    return <NotFound />;
  }
}
