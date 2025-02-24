'use client';

import { ProductBase } from '@/app/models/products-model';
import BaseProductForm from '../base/product-form';
import { Lookup } from '@/app/models/lookups-model';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';

import { UpdateProduct } from '@/app/actions/server/products-actions';
import { UploadFileSingle } from '@/app/actions/server/files-actions';

import { toast } from '@/hooks/use-toast';

interface ProductsByIdEditProps {
  product: ProductBase;
  categoryLookup: Lookup[];
  statusLookup: Lookup[];
  sizeLookup: Lookup[];
  spiceLookup: Lookup[];
}

const entity = 'product';
const base =
  process.env.NEXT_PUBLIC_APP_API_SERVER_URL ||
  'https://posapi-dev.ceburrito.ph';

const appInstance = process.env.NEXT_PUBLIC_APP_INSTANCE || 'dev';

export default function ProductsByIdEdit({
  product,
  categoryLookup,
  statusLookup,
  sizeLookup,
  spiceLookup,
}: ProductsByIdEditProps) {
  const handleProductSubmit = async (data: ProductBase) => {
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
    if (appInstance === 'prod') {
      toast({
        title: 'Update success',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {`Product name : ${productUpdated.name}`}
            </code>
          </pre>
        ),
      });
    } else {
      toast({
        title: 'Update success',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(productUpdated, null, 2)}
            </code>
          </pre>
        ),
      });
    }
    revalidateAndRedirectUrl('/products');
  };

  return (
    <BaseProductForm
      initialData={product}
      onSubmit={handleProductSubmit}
      categories={categoryLookup}
      statuses={statusLookup}
      sizes={sizeLookup}
      spices={spiceLookup}
    />
  );
}
