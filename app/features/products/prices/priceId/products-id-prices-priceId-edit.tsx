'use client';

import { Lookup } from '@/app/models/lookups-model';

import ProductsByIdPricesFormBase from '../base/products-id-prices-form';
import {
  ProductBase,
  ProductSellingPriceBase,
} from '@/app/models/products-model';

import { CustomerBase } from '@/app/models/customers-model';
//import { StoreBase } from '@/app/models/stores-model';
import { OrganizationBase } from '@/app/models/organizations-model';

interface productsByIdPricesCreateProps {
  product: ProductBase;
  initialData?: ProductSellingPriceBase;
  orderTypes: Lookup[];
  sizeOptions: Lookup[];
  customers: CustomerBase[];
  stores: OrganizationBase[];
}

export default function ProductsIdPricesPriceIdEdit({
  product,
  initialData,
  orderTypes,
  sizeOptions,
  customers,
  stores,
}: productsByIdPricesCreateProps) {
  return (
    <ProductsByIdPricesFormBase
      product={product}
      initialData={initialData}
      orderTypes={orderTypes}
      sizeOptions={sizeOptions}
      customers={customers}
      stores={stores}
    />
  );
}
