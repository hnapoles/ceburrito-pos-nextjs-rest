import ProductUpdate from '@/app/features/products/update/product-update';

import { apiClientDq } from '@/lib/fetch-helper';

import { FindLookupOutput } from '@/app/model/lookups-model';
import {
  ProductData,
  ProductSellingPricesData,
} from '@/app/model/products-model';
import { FindAll, ApiOperationNames, FindOne } from '@/app/model/api-model';

import { GetProductSellingPricesByProductId } from '@/app/action/server/product-selling-prices-actions';
import { GetProductById } from '@/app/action/server/products-actions';
import { GetLookups } from '@/app/action/server/lookups-actions';

//start of function
export default async function ProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const product = await GetProductById(id);
  const lookups = await GetLookups('product', null);

  //const categories = lookups.data.find((item) => item.lookupCode === 'category') || [];
  const categories = lookups.data.filter(
    (item) => item.lookupCode === 'category',
  );
  const statuses = lookups.data.filter((item) => item.lookupCode === 'status');

  console.log(lookups);
  console.log(categories);
  console.log(statuses);

  return <div>Testing...</div>;

  /*
  return (
    <ProductUpdate product={product} types={types} categories={categories} />
  );
  */
}
