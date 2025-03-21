import { GetProductSellingPricesByProductId } from '@/app/actions/server/product-selling-prices-actions';
import { GetProductById } from '@/app/actions/server/products-actions';
import {
  GetLookupCustomers,
  GetLookups,
  GetLookupStores,
} from '@/app/actions/server/lookups-actions';
import NotFoundGlobal from '@/app/nav/not-found-global';
/*
import {
  DefaultSizeOptions,
  DefaultSpiceOptions,
} from '@/app/models/lookups-model';
*/

import ProductsByIdEdit from '@/app/features/products/id/edit/products-id-edit';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { WhoTabContent } from '@/app/nav/who-tab-content';
import { UserWhoProps } from '@/app/models/users-model';

import ProductsByIdPricesTableSimple from '@/app/features/products/id/edit/products-id-prices-table-simple';
import ErrorDisplay from '@/app/features/error/error-display';

//import { IsUserPermissionLevelAllowed } from '@/app/actions/server/permissions-actions';
//import ErrorDisplay from '@/app/features/error/error-display';

//start of function
export default async function ProductUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  /*
  const isAllowed = await IsUserPermissionLevelAllowed('admin');
  if (!isAllowed)
    return (
      <ErrorDisplay
        message={'No permission to access this page'}
        type={'error'}
      />
    );
  */

  const isAllowed = false;
  if (!isAllowed)
    return <ErrorDisplay message={'Permission denied.'} type={'error'} />;

  const product = await GetProductById(id);
  const lookups = await GetLookups('product', null);

  const categoriesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'category',
  );
  const statusesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'status',
  );

  if (!product) {
    return (
      <NotFoundGlobal display={'Product data not found'} backUrl={'/product'} />
    );
  }
  const productPrices = await GetProductSellingPricesByProductId(
    product._id || '',
  );

  const customers = await GetLookupCustomers();
  const stores = await GetLookupStores();
  const { data: orderTypesLookup } = await GetLookups('order', 'type'); //specific to order and type - returns count and data

  /*
  let { data: sizeOptionsLookup } = await GetLookups('order', 'sizeOptions');
  if (!sizeOptionsLookup) sizeOptionsLookup = DefaultSizeOptions;
  let { data: spiceOptionsLookup } = await GetLookups('order', 'spiceOptions');
  if (!spiceOptionsLookup) spiceOptionsLookup = DefaultSpiceOptions;
  */

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
      </>
    );

  const who: UserWhoProps = {
    createdBy: product?.createdBy,
    createdAt: product?.createdAt ? new Date(product.createdAt) : undefined,
    updatedBy: product?.updatedBy,
    updatedAt: product?.updatedAt ? new Date(product.updatedAt) : undefined,
  };

  return (
    //grid cols=2 normal, cols1 for small
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Product Image and Details */}
      <div>
        <ProductsByIdEdit
          product={product}
          categoryLookup={categoriesLookup}
          statusLookup={statusesLookup}
        />
      </div>
      {/* Right Side - Product Tabs */}
      <div>
        <Tabs defaultValue="prices">
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
            {/* Prices Content */}
            <ProductsByIdPricesTableSimple
              productName={product.name}
              productId={product._id || ''}
              data={productPrices.data}
              limit={100}
              page={1}
              totalDataCount={productPrices.count}
            />
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
