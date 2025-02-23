import { GetProductSellingPricesByProductId } from '@/app/actions/server/product-selling-prices-actions';
import { GetProductById } from '@/app/actions/server/products-actions';
import {
  GetLookupCustomers,
  GetLookups,
  GetLookupStores,
} from '@/app/actions/server/lookups-actions';
import NotFound from '../not-found';
import { DefaultSizeOptions } from '@/app/models/lookups-model';

import ProductsByIdEdit from '@/app/features/products/products-id-edit';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { WhoTabContent } from '@/app/nav/who-tab-content';
import { UserWhoProps } from '@/app/models/users-model';

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
  if (false)
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

  const who: UserWhoProps = {
    createdBy: product?.createdBy,
    createdAt: product?.createdAt,
    updatedBy: product?.updatedBy,
    updatedAt: product?.updatedAt,
  };

  return (
    //grid cols=2 normal, cols1 for small
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Product Image and Details */}
      <div>
        <ProductsByIdEdit
          product={product}
          categoryLookups={categoriesLookup}
        />
      </div>
      {/* Right Side - Product Tabs */}
      <div>
        <Tabs defaultValue="who">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="who">Who</TabsTrigger>
              <TabsTrigger value="prices">Prices</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="who" className="px-0">
            <WhoTabContent who={who} />
          </TabsContent>
          <TabsContent value="prices" className="px-0">
            Prices here...
          </TabsContent>
          <TabsContent value="attributes" className="px-0">
            [future] : attributes here...
          </TabsContent>
          <TabsContent value="sales" className="px-0">
            [future] : sales here...
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
