import { GetOrders } from '@/app/actions/server/orders-actions';
import { GetLookups } from '@/app/actions/server/lookups-actions';
import OrdersList from '@/app/features/orders/list/orders-list';

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
  const status = searchParams.status ?? 'open';

  const results = await GetOrders(keyword, page, limit, status);
  const orders = results.data;
  const totalOrders = results.count;

  const { data: statusesLookup } = await GetLookups('order', 'status');

  return (
    <OrdersList
      orders={orders}
      limit={parseInt(limit)}
      page={parseInt(page)}
      totalDataCount={totalOrders}
      statusesLookup={statusesLookup}
      currentTab={status}
    />
  );
}
