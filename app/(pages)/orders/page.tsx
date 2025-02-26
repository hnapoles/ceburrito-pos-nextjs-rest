import OrdersListPage from '@/app/features/orders/list/orders-list-page';
import NotFoundGlobal from '@/app/nav/not-found-global';
import { GetOrders } from '@/app/actions/server/orders-actions';
import { GetLookups } from '@/app/actions/server/lookups-actions';

export default async function OrdersPage(props: {
  searchParams: Promise<{
    keyword: string;
    page: string;
    limit: string;
    status: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword ?? null;
  const limit = searchParams.limit ?? '10';
  const page = searchParams.page ?? '1';
  const status = searchParams.status ?? 'all';

  const results = await GetOrders(keyword, page, limit, status);
  const orders = results.data;
  const totalOrders = results.count;

  const { data: statusesLookup } = await GetLookups('order', 'status');

  if (orders) {
    return (
      <OrdersListPage
        orders={orders}
        limit={parseInt(limit)}
        page={parseInt(page)}
        totalDataCount={totalOrders}
        statusesLookup={statusesLookup}
        currentTab={status}
      />
    );
  }

  if (!orders) {
    return (
      <NotFoundGlobal display={'Order data not found'} backUrl={'/dashboard'} />
    );
  }
}
