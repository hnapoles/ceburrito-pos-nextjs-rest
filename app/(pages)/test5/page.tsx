'use client';

import ProductForm from './form';

export default function InsertProductPage() {
  const handleProductSubmit = async (data: any) => {
    console.log('New Product Data:', data);
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  return <ProductForm onSubmit={handleProductSubmit} />;
}
