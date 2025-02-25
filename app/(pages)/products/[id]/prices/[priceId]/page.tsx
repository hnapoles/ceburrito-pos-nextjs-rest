import { GetProductById } from '@/app/actions/server/products-actions';
import { GetLookups } from '@/app/actions/server/lookups-actions';
import ProductsIdPricesPriceIdEdit from '@/app/features/products/id/prices/priceId/products-id-prices-priceId-edit';
import { GetProductSellingPricesByOwnId } from '@/app/actions/server/product-selling-prices-actions';

export default async function ProductsByIdPricesEditPage({
  params,
}: {
  params: Promise<{ id: string; priceId: string }>;
}) {
  const id = (await params).id;
  const priceId = (await params).priceId;

  const product = await GetProductById(id);
  const lookups = await GetLookups('product', null);

  const productPrice = await GetProductSellingPricesByOwnId(priceId);
  console.log(productPrice);

  return (
    <ProductsIdPricesPriceIdEdit product={product} initialData={productPrice} />
  );
}
