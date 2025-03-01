import { GetLookups } from '@/app/actions/server/lookups-actions';
import {
  DefaultSizeOptions,
  DefaultSpiceOptions,
} from '@/app/models/lookups-model';

import ProductsCreate from '@/app/features/products/create/products-create';

//start of function
export default async function ProductUpdatePage() {
  const lookups = await GetLookups('product', null);

  const categoriesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'category',
  );
  const statusesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'status',
  );

  let { data: sizeOptionsLookup } = await GetLookups('order', 'sizeOptions');
  if (!sizeOptionsLookup) sizeOptionsLookup = DefaultSizeOptions;

  let { data: spiceOptionsLookup } = await GetLookups('order', 'spiceOptions');
  if (!spiceOptionsLookup) spiceOptionsLookup = DefaultSpiceOptions;

  //if-testing - set to true
  if (false)
    return (
      <>
        <div>Testing...</div>

        <pre>categories: {JSON.stringify(categoriesLookup, null, 2)}</pre>
        <pre>statuses: {JSON.stringify(statusesLookup, null, 2)}</pre>

        <pre>
          sizeOptionsLookup: {JSON.stringify(sizeOptionsLookup, null, 2)}
        </pre>
      </>
    );

  return (
    //grid cols=2 normal, cols1 for small
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Product Image and Details */}
      <div>
        <ProductsCreate
          categoryLookup={categoriesLookup}
          statusLookup={statusesLookup}
          sizeLookup={sizeOptionsLookup}
          spiceLookup={spiceOptionsLookup}
        />
      </div>
      {/* Right Side - Product Tabs */}
      <div></div>
    </div>
  );
}
