import { GetLookups } from '@/app/actions/server/lookups-actions';
import { GetOrderById } from '@/app/actions/server/orders-actions';
import { GetProducts } from '@/app/actions/server/products-actions';
import OrdersIdAddItemsBase from '@/app/features/orders/id/addItems/zorders-id-addItems-base';
import NotFoundGlobal from '@/app/nav/not-found-global';

export default async function OrdersIdAddItemsPage(props: {
  searchParams: Promise<{
    keyword: string;
    page: string;
    limit: string;
    id: string;
  }>;
  params: Promise<{ id: string }>;
}) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? null;
  const limit = searchParams.limit ?? '99999';
  const page = searchParams.page ?? '1';

  const id = (await props.params).id;

  const order = await GetOrderById(id);

  const results = await GetProducts(
    keyword,
    page,
    limit,
    'active',
    true,
    'all',
  );
  const products = results.data;
  //const totalProducts = results.count;

  const { data: categoriesLookup } = await GetLookups('product', 'category');

  if (!products) {
    return (
      <NotFoundGlobal display={'Product data not found'} backUrl={'/orders'} />
    );
  }

  return (
    <OrdersIdAddItemsBase
      products={products}
      categories={categoriesLookup}
      orderData={order}
    />
  );
}
