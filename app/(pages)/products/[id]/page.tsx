import { GetProductSellingPricesByProductId } from '@/app/actions/server/product-selling-prices-actions';
import { GetProductById } from '@/app/actions/server/products-actions';
import {
  GetLookupCustomers,
  GetLookups,
} from '@/app/actions/server/lookups-actions';
import NotFound from '../not-found';

//start of function
export default async function ProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const product = await GetProductById(id);
  const lookups = await GetLookups('product', null);

  const categories = lookups.data.filter(
    (item) => item.lookupCode === 'category',
  );
  const statuses = lookups.data.filter((item) => item.lookupCode === 'status');

  if (!product) {
    return <NotFound />;
  }
  const productPrices = await GetProductSellingPricesByProductId(
    product._id || '',
  );

  const customersLookup = GetLookupCustomers();
  //get ordertypes
  //get stores
  //get sizeOptions

  //if-testing - set to true
  if (true)
    return (
      <>
        <div>Testing...</div>
        <pre>product data: {JSON.stringify(product, null, 2)}</pre>
        <pre>categories: {JSON.stringify(categories, null, 2)}</pre>
        <pre>statuses: {JSON.stringify(statuses, null, 2)}</pre>
        <pre>productPrices: {JSON.stringify(productPrices, null, 2)}</pre>
        <pre>customersLookup: {JSON.stringify(customersLookup, null, 2)}</pre>
      </>
    );
}
