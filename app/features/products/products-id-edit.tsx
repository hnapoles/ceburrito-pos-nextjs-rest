'use client';

import BaseProductForm from './base-product-form';

export default function ProductsByIdEdit() {
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
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Product Image and Details */}
      <div>
        <BaseProductForm
          initialData={mockProduct}
          onSubmit={handleProductSubmit}
        />
      </div>

      {/* Right Side - Product Tabs */}
      <div>Right Side</div>
    </div>
  );
}
