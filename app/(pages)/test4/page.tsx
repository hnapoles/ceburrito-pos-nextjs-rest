'use client';

import ProductForm from './form';

interface OrderOptions {
  sizeOption: 'S' | 'M' | 'L';
  sizeAffectPricing: boolean;
  spiceOption: 'mild' | 'regular' | 'super spicy';
  spiceAffectPricing: boolean;
}

const mockProduct = {
  name: 'Sample Product',
  description: 'This is a sample description.',
  price: 99.99,
  status: 'active',
  imageUrl: 'https://example.com/sample.jpg',
  orderOptions: {
    sizeOption: 'M' as 'M',
    sizeAffectPricing: true,
    spiceOption: 'regular' as 'regular',
    spiceAffectPricing: false,
  } satisfies OrderOptions, // Ensures proper TypeScript compatibility
};

export default function EditProductPage() {
  const handleProductUpdate = async (data: any) => {
    console.log('Updated Product Data:', data);
    await fetch(`/api/products/${mockProduct.name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  return (
    <ProductForm initialData={mockProduct} onSubmit={handleProductUpdate} />
  );
}
