'use client';

import { Lookup } from '@/app/models/lookups-model';

import ProductsByIdPricesFormBase from '../base/products-id-prices-form';
import { ProductBase } from '@/app/models/products-model';
import { CustomerBase } from '@/app/models/customers-model';
import { StoreBase } from '@/app/models/stores-model';

interface productsByIdPricesCreateProps {
  product: ProductBase;
  sizeLookup?: Lookup[];
  spiceLookup?: Lookup[];
  orderTypes: Lookup[];
  sizeOptions: Lookup[];
  customers: CustomerBase[];
  stores: StoreBase[];
}

export default function ProductsIdPricesCreate({
  product,
  orderTypes,
  sizeOptions,
  customers,
  stores,
}: productsByIdPricesCreateProps) {
  return (
    <ProductsByIdPricesFormBase
      product={product}
      orderTypes={orderTypes}
      sizeOptions={sizeOptions}
      customers={customers}
      stores={stores}
    />
  );
}
