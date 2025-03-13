import NotFoundGlobal from '@/app/nav/not-found-global';
import { GetLookups } from '@/app/actions/server/lookups-actions';
import { GetProducts } from '@/app/actions/server/products-actions';
import OrdersCreateByOrderType from '@/app/features/orders/create/orders-create-order-type';

export default async function OrdersPage(props: {
  searchParams: Promise<{
    keyword: string;
    page: string;
    limit: string;
    orderType: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? null;
  const limit = searchParams.limit ?? '99999';
  const page = searchParams.page ?? '1';
  const orderType = searchParams.orderType || 'pos';

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
  const { data: searchTagsLookup } = await GetLookups('product', 'searchTag');

  const searchTags = (searchTagsLookup || []).map((item) => item.lookupValue);

  if (!products) {
    return (
      <NotFoundGlobal
        display={'Product data not found'}
        backUrl={'/dashboard'}
      />
    );
  }

  /*
  return (
    <OrdersCreatePosPage products={products} categories={categoriesLookup} />
  );
  */

  return (
    <OrdersCreateByOrderType
      products={products}
      categories={categoriesLookup}
      searchTags={searchTags}
      orderType={orderType}
    />
  );
}
