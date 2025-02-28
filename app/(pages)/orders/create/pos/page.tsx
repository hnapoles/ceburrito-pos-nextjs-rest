import NotFoundGlobal from '@/app/nav/not-found-global';
import { GetLookups } from '@/app/actions/server/lookups-actions';
import { GetProducts } from '@/app/actions/server/products-actions';
import OrdersCreatePosPage from '@/app/features/orders/create/pos/orders-create-pos-base';

export default async function OrdersPage(props: {
  searchParams: Promise<{
    keyword: string;
    page: string;
    limit: string;
    category: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? null;
  const limit = searchParams.limit ?? '10';
  const page = searchParams.page ?? '1';
  const category = searchParams.category ?? 'all';

  const results = await GetProducts(keyword, page, limit, 'active');
  const products = results.data;
  const totalProducts = results.count;

  const { data: categoriesLookup } = await GetLookups('product', 'category');

  if (!products) {
    return (
      <NotFoundGlobal
        display={'Product data not found'}
        backUrl={'/dashboard'}
      />
    );
  }

  return (
    <OrdersCreatePosPage
      products={products}
      categories={categoriesLookup}
      currentTab={category}
    />
  );
}
