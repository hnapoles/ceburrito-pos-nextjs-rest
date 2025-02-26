import { GetProductById } from '@/app/actions/server/products-actions';
import ProductsIdPricesPriceIdEdit from '@/app/features/products/id/prices/priceId/products-id-prices-priceId-edit';
import { GetProductSellingPricesByOwnId } from '@/app/actions/server/product-selling-prices-actions';
import ProductsByIdPricesTableSimple from '@/app/features/products/id/products-id-prices-table-simple';

import { GetProductSellingPricesByProductId } from '@/app/actions/server/product-selling-prices-actions';

import {
  GetLookupCustomers,
  GetLookups,
  GetLookupStores,
} from '@/app/actions/server/lookups-actions';

import { DefaultSizeOptions } from '@/app/models/lookups-model';

export default async function ProductsByIdPricesEditPage({
  params,
}: {
  params: Promise<{ id: string; priceId: string }>;
}) {
  const id = (await params).id;
  const priceId = (await params).priceId;

  const product = await GetProductById(id);
  const productPrices = await GetProductSellingPricesByProductId(
    product._id || '',
  );

  const productPrice = await GetProductSellingPricesByOwnId(priceId);

  //use server fetch - not client
  //this is faster
  const customers = await GetLookupCustomers();
  const stores = await GetLookupStores();
  const { data: orderTypesLookup } = await GetLookups('order', 'type'); //specific to order and type - returns count and data
  let { data: sizeOptionsLookup } = await GetLookups('order', 'sizeOptions');
  if (!sizeOptionsLookup) sizeOptionsLookup = DefaultSizeOptions;

  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      <div>
        <ProductsIdPricesPriceIdEdit
          product={product}
          initialData={productPrice}
          customers={customers}
          stores={stores}
          orderTypes={orderTypesLookup}
          sizeOptions={sizeOptionsLookup}
        />
      </div>
      {/* Right Side - Product Tabs */}
      <div>
        {/* Prices Content */}
        <ProductsByIdPricesTableSimple
          productName={product.name}
          productId={product._id || ''}
          data={productPrices.data}
          limit={100}
          page={1}
          totalDataCount={productPrices.count}
        />
      </div>
    </div>
  );
}
