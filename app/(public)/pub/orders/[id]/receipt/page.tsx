import { GetOrderByIdForPublic } from '@/app/actions/server/orders-actions';

import NotFoundGlobal from '@/app/nav/not-found-global';

import OrdersByIdReceipt from '@/app/features/orders/id/orders-id-receipt';

//start of function
export default async function PubOrdersByIdReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    pubKey: string;
  }>;
}) {
  const id = (await params).id;
  const pubKey = (await searchParams).pubKey || 'no-key';

  const order = await GetOrderByIdForPublic(id, pubKey);

  if (!order) {
    return (
      <NotFoundGlobal display={'Order data not found'} backUrl={'/orders'} />
    );
  }

  return <OrdersByIdReceipt order={order} showQrCode={false} />;
}
