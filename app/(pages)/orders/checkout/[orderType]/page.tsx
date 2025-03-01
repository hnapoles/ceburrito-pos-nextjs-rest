//start of function
export default async function OrdersCheckoutByOrderType({
  params,
}: {
  params: Promise<{ orderType: string }>;
}) {
  const orderType = (await params).orderType;

  return <div>{orderType}</div>;
}
