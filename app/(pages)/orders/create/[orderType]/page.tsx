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
  params: { orderType: string }; // Capture orderType from the path
}) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? null;
  const limit = searchParams.limit ?? '99999';
  const page = searchParams.page ?? '1';
  const orderType = (await props.params.orderType) || 'pos';

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

  //only allow pos order type on this page -- all other types (btb, btc) is on another app
  //this is to simplify this app
  if (!products) {
    return (
      <NotFoundGlobal
        display={'Product data not found'}
        backUrl={'/dashboard'}
      />
    );
  }

  if (orderType !== 'pos') {
    return (
      <NotFoundGlobal
        display={`Order type [${orderType}], not valid for this app.`}
        backUrl={'/orders'}
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
