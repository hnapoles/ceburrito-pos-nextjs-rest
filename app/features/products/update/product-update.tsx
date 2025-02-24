'use client';
import { useEffect } from 'react';

import {
  ProductBase,
  ProductSellingPriceBase,
} from '@/app/models/products-model';
import { Lookup } from '@/app/models/lookups-model';

import ProductUpdateForm from './product-update-form';
import ProductUpdateTabs from './product-update-tabs';

import { useGlobalStore } from '@/app/providers/zustand-provider';

export default function ProductUpdate({
  product,
  types,
  categories,
}: {
  product: ProductBase;
  types: Lookup[];
  categories: Lookup[];
}) {
  const setProduct = useGlobalStore((state) => state.setProduct);
  //const setProductSellingPrices = useGlobalStore(
  //  (state) => state.setProductSellingPrices,
  //);

  useEffect(() => {
    if (product) {
      setProduct(product);
    }

    //setProductSellingPrices(productPrices);
  }, [product]);

  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Product Image and Details */}
      <div>
        <ProductUpdateForm types={types} categories={categories} />
      </div>

      {/* Right Side - Product Tabs */}
      <div>
        <ProductUpdateTabs />
      </div>
    </div>
  );
}
