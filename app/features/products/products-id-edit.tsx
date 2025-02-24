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

  const mockProduct = {
    name: 'Sample Product',
    description: 'This is a sample description.',
    price: 99.99,
    status: 'active',
    imageUrl: 'https://example.com/sample.jpg',
    orderOptions: {
      sizeOption: ['S', 'M'], // ✅ Correct type (string[])
      sizeAffectPricing: true,
      spiceOption: 'regular' as 'mild' | 'regular' | 'super spicy', // ✅ Explicitly cast the value
      spiceAffectPricing: false,
    },
  };

  return (
    <BaseProductForm initialData={mockProduct} onSubmit={handleProductSubmit} />
  );
}
