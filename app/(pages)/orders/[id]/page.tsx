import { GetOrderById } from '@/app/actions/server/orders-actions';
import {
  GetLookupCustomers,
  GetLookups,
} from '@/app/actions/server/lookups-actions';
import NotFoundGlobal from '@/app/nav/not-found-global';

import OrdersIdBase from '@/app/features/orders/id/orders-id-base';

//start of function
export default async function OrdersByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const order = await GetOrderById(id);
  const lookups = await GetLookups('order', null);

  const statusesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'status',
  );

  const orderTypesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'type',
  );

  const { data: dineModes } = await GetLookups(order.type || '', 'dineMode');
  const { data: paymentMethods } = await GetLookups('order', 'paymentMethod');
  const { data: statuses } = await GetLookups('order', 'status');

  if (!order) {
    return (
      <NotFoundGlobal display={'Order data not found'} backUrl={'/orders'} />
    );
  }

  console.log('order data from the server ', order);

  const customers = await GetLookupCustomers();

  //if-testing - set to true
  if (false)
    return (
      <>
        <div>Testing...</div>
        <pre>order data: {JSON.stringify(order, null, 2)}</pre>
        <pre>statuses: {JSON.stringify(statusesLookup, null, 2)}</pre>
        <pre>customersLookup: {JSON.stringify(customers, null, 2)}</pre>
        <pre>orderTypesLookup: {JSON.stringify(orderTypesLookup, null, 2)}</pre>
      </>
    );

  return (
    <OrdersIdBase
      orderData={order}
      dineModes={dineModes}
      paymentMethods={paymentMethods}
      statuses={statuses}
    />
  );
}
