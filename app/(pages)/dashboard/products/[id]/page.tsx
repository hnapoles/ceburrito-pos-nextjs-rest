import ProductUpdate from '@/app/modules/products/update/product-update';

import { apiClientDq } from '@/lib/fetch-helper';

import { LookupQueryResults } from '@/app/model/lookups-model';
import {
  ProductCategoryFilter,
  ProductTypeFilter,
  ProductData,
  ProductSellingPricesData,
} from '@/app/model/products-model';
import { FindAll, ApiOperationNames, FindOne } from '@/app/model/api-model';

//import { apiComplexDq } from '@/lib/fetch-helper';

import { GetProductSellingPricesById } from '@/app/action/server/product-selling-prices-actions';

//start of function
export default async function ProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const method = 'POST';
  const id = (await params).id;

  const product = await apiClientDq<ProductData, FindOne>(
    'product',
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );

  const lookup1 = await apiClientDq<LookupQueryResults, FindAll>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: ProductTypeFilter },
  );

  const types = lookup1.data;

  const lookup2 = await apiClientDq<LookupQueryResults, FindAll>(
    'lookup',
    ApiOperationNames.FindAll,
    '',
    { method: 'POST', body: ProductCategoryFilter },
  );

  const categories = lookup2.data;

  //const result = await GetProductSellingPricesById(id);
  //const productPrices = result.data;

  return (
    <ProductUpdate product={product} types={types} categories={categories} />
  );
}
