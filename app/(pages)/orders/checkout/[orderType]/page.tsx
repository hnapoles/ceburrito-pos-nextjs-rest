import OrdersCheckoutBase from '@/app/features/orders/checkout/orders-checkout-base';

//start of function
export default async function OrdersCheckoutByOrderType({
  params,
}: {
  params: Promise<{ orderType: string }>;
}) {
  const orderType = (await params).orderType;

  return <OrdersCheckoutBase orderType={orderType} />;
}
