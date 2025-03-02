import { GetLookups } from '@/app/actions/server/lookups-actions';
import OrdersCheckoutBase from '@/app/features/orders/checkout/orders-checkout-base';

//start of function
export default async function OrdersCheckoutByOrderType({
  params,
}: {
  params: Promise<{ orderType: string }>;
}) {
  const orderType = (await params).orderType;

  const { data: dineModes } = await GetLookups(orderType, 'dineMode');
  const { data: paymentMethods } = await GetLookups('order', 'paymentMethod');

  return (
    <OrdersCheckoutBase
      orderType={orderType}
      dineModes={dineModes}
      paymentMethods={paymentMethods}
    />
  );
}
