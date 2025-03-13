import { GetLookups } from '@/app/actions/server/lookups-actions';
import OrdersCheckout from '@/app/features/orders/checkout/orders-checkout';

//start of function
export default async function OrdersCheckoutByOrderType({
  params,
}: {
  params: Promise<{ orderType: string }>;
}) {
  const orderType = (await params).orderType;

  const { data: dineModes } = await GetLookups(orderType, 'dineMode');
  const { data: paymentMethods } = await GetLookups('order', 'paymentMethod');
  const { data: statuses } = await GetLookups('order', 'status');

  return (
    <OrdersCheckout
      orderType={orderType}
      dineModes={dineModes}
      paymentMethods={paymentMethods}
      statuses={statuses}
    />
  );
}
