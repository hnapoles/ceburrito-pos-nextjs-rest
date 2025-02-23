'use client';

import ProductForm from './form';

export default function InsertProductPage() {
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
    <ProductForm initialData={mockProduct} onSubmit={handleProductSubmit} />
  );
}
