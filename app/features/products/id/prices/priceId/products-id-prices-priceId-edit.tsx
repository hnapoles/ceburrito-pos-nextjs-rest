'use client';

import { Lookup } from '@/app/models/lookups-model';

import ProductsByIdPricesFormBase from '../base/products-id-prices-form';
import {
  ProductBase,
  ProductSellingPriceBase,
} from '@/app/models/products-model';

interface productsByIdPricesCreateProps {
  product: ProductBase;
  initialData: ProductSellingPriceBase;
  sizeLookup?: Lookup[];
  spiceLookup?: Lookup[];
}

const entity = 'product_selling_price';
const base =
  process.env.NEXT_PUBLIC_APP_API_SERVER_URL ||
  'https://posapi-dev.ceburrito.ph';

const appInstance = process.env.NEXT_PUBLIC_APP_INSTANCE || 'dev';

export default function ProductsIdPricesPriceIdEdit({
  product,
  initialData,
  sizeLookup,
  spiceLookup,
}: productsByIdPricesCreateProps) {
  return (
    <ProductsByIdPricesFormBase product={product} initialData={initialData} />
  );
}
