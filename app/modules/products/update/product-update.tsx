'use client';
import { useEffect } from 'react';

import { ProductData } from '@/app/model/products-model';
import { Lookup } from '@/app/model/lookups-model';

import ProductUpdateForm from './product-update-form';
import ProductUpdateTabs from './product-update-tabs';

import { IProductPrices } from '@/app/model/products-model';

import { useGlobalStore } from '@/app/provider/zustand-provider';

export default function ProductUpdate({
  product,
  types,
  categories,
  productPrices,
}: {
  product: ProductData;
  types: Lookup[];
  categories: Lookup[];
  productPrices: IProductPrices[];
}) {
  const setProduct = useGlobalStore((state) => state.setProduct);

  useEffect(() => {
    setProduct(product);
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Product Image and Details */}
      <div>
        <ProductUpdateForm types={types} categories={categories} />
      </div>

      {/* Right Side - Product Tabs */}
      <div>
        <ProductUpdateTabs productPrices={productPrices} />
      </div>
    </div>
  );
}
