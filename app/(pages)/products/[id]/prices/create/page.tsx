import { GetProductById } from '@/app/actions/server/products-actions';
import { GetLookups } from '@/app/actions/server/lookups-actions';
import ProductsIdPricesCreate from '@/app/features/products/id/prices/create/products-id-prices-create';

export default async function ProductsByIdPricesCreatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const product = await GetProductById(id);
  const lookups = await GetLookups('product', null);

  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      <ProductsIdPricesCreate product={product} />;
    </div>
  );
}
