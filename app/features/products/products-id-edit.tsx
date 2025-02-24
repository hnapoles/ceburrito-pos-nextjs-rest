'use client';

import { ProductBase } from '@/app/models/products-model';
import BaseProductForm from './base-product-form';
import { Lookup } from '@/app/models/lookups-model';

interface ProductsByIdEditProps {
  product: ProductBase;
  categoryLookups: Lookup[];
  statusLookups: Lookup[];
}

export default function ProductsByIdEdit({
  product,
  categoryLookups,
  statusLookups,
}: ProductsByIdEditProps) {
  const handleProductSubmit = async (data: any) => {
    console.log('New Product Data:', data);

    /*
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    */
  };

  return (
    <BaseProductForm
      initialData={product}
      onSubmit={handleProductSubmit}
      categories={categoryLookups}
      statuses={statusLookups}
    />
  );
}
