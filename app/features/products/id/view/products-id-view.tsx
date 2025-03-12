'use client';

import { ProductBase } from '@/app/models/products-model';
import BaseProductForm from '../../base/product-form';
import { Lookup } from '@/app/models/lookups-model';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';

import { UpdateProduct } from '@/app/actions/server/products-actions';
import { UploadFileSingle } from '@/app/actions/server/files-actions';

interface ProductsByIdViewProps {
  product: ProductBase;
  categoryLookup: Lookup[];
  statusLookup: Lookup[];
  sizeLookup?: Lookup[];
  spiceLookup?: Lookup[];
}

const entity = 'product';
const base =
  process.env.NEXT_PUBLIC_APP_API_SERVER_URL ||
  'https://posapi-dev.ceburrito.ph';

export default function ProductsByIdView({
  product,
  categoryLookup,
  statusLookup,
}: ProductsByIdViewProps) {
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

    await UpdateProduct(data);
    revalidateAndRedirectUrl('/products');
  };

  return (
    <BaseProductForm
      initialData={product}
      onSubmit={handleProductSubmit}
      categories={categoryLookup}
      statuses={statusLookup}
      isViewOnly={true}
    />
  );
}
