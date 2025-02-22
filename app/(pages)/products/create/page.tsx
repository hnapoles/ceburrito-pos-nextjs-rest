import ProductCreateForm from '@/app/features/products/create/products-create-form';

import { apiClientDq } from '@/lib/fetch-helper';

import { FindLookupOutput } from '@/app/models/lookups-model';
import {
  ProductCategoryFilter,
  ProductTypeFilter,
} from '@/app/models/products-model';
import { FindAll, ApiOperationNames } from '@/app/models/api-model';

export default async function ProductCreatePage() {
  const lookup1 = await apiClientDq<FindLookupOutput, FindAll>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: ProductTypeFilter },
  );

  const types = lookup1.data;

  const lookup2 = await apiClientDq<FindLookupOutput, FindAll>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: ProductCategoryFilter },
  );

  const categories = lookup2.data;

  return <ProductCreateForm types={types} categories={categories} />;
}
