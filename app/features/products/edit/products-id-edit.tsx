'use client';

import { ProductBase } from '@/app/models/products-model';
import BaseProductForm from '../base/base-product-form';
import { Lookup } from '@/app/models/lookups-model';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';

import { UpdateProduct } from '@/app/actions/server/products-actions';
import { UploadFileSingle } from '@/app/actions/server/files-actions';

import { toast } from '@/hooks/use-toast';

interface ProductsByIdEditProps {
  product: ProductBase;
  categoryLookups: Lookup[];
  statusLookups: Lookup[];
}

const entity = 'product';
const base =
  process.env.APP_API_SERVER_URL || 'https://posapi-dev.ceburrito.ph';

export default function ProductsByIdEdit({
  product,
  categoryLookups,
  statusLookups,
}: ProductsByIdEditProps) {
  const handleProductSubmit = async (data: any) => {
    let newImageUrl = '';
    if (data.imageFile) {
      const formData = new FormData();
      formData.append('file', data.imageFile);

      const uploaded = await UploadFileSingle(formData, entity);
      newImageUrl = `${base}/public/${uploaded.fileName}`;
    }

    delete data.imageFile;
    data.imageUrl = newImageUrl;

    const productUpdated = await UpdateProduct(data);
    toast({
      title: 'Data saved',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(productUpdated, null, 2)}
          </code>
        </pre>
      ),
    });
    revalidateAndRedirectUrl('/products');
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
