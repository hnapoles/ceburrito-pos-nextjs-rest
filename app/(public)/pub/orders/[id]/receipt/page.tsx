import { GetOrderById } from '@/app/actions/server/orders-actions';

import NotFoundGlobal from '@/app/nav/not-found-global';

import OrdersByIdReceipt from '@/app/features/orders/id/orders-id-receipt';

//start of function
export default async function PubOrdersByIdReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const order = await GetOrderById(id);

  if (!order) {
    return (
      <NotFoundGlobal display={'Order data not found'} backUrl={'/orders'} />
    );
  }

  return <OrdersByIdReceipt order={order} showQrCode={false} />;
}
