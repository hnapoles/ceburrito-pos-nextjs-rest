import { GetProductSellingPricesByProductId } from '@/app/actions/server/product-selling-prices-actions';
import { GetProductById } from '@/app/actions/server/products-actions';
import {
  GetLookupCustomers,
  GetLookups,
  GetLookupStores,
} from '@/app/actions/server/lookups-actions';
import NotFound from '../not-found';
import { DefaultSizeOptions } from '@/app/models/lookups-model';

//start of function
export default async function ProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const product = await GetProductById(id);
  const lookups = await GetLookups('product', null);

  const categoriesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'category',
  );
  const statusesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'status',
  );

  if (!product) {
    return <NotFound />;
  }
  const productPrices = await GetProductSellingPricesByProductId(
    product._id || '',
  );

  const customers = await GetLookupCustomers();
  const stores = await GetLookupStores();
  const { data: orderTypesLookup } = await GetLookups('order', 'type'); //specific to order and type - returns count and data
  let { data: sizeOptionsLookup } = await GetLookups('order', 'sizeOptions');
  if (!sizeOptionsLookup) sizeOptionsLookup = DefaultSizeOptions;

  //if-testing - set to true
  if (true)
    return (
      <>
        <div>Testing...</div>
        <pre>product data: {JSON.stringify(product, null, 2)}</pre>
        <pre>categories: {JSON.stringify(categoriesLookup, null, 2)}</pre>
        <pre>statuses: {JSON.stringify(statusesLookup, null, 2)}</pre>
        <pre>productPrices: {JSON.stringify(productPrices, null, 2)}</pre>
        <pre>customersLookup: {JSON.stringify(customers, null, 2)}</pre>
        <pre>storesLookup: {JSON.stringify(stores, null, 2)}</pre>
        <pre>orderTypesLookup: {JSON.stringify(orderTypesLookup, null, 2)}</pre>
        <pre>
          sizeOptionsLookup: {JSON.stringify(sizeOptionsLookup, null, 2)}
        </pre>
      </>
    );
}
