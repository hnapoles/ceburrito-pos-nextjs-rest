import {
  GetOrderById,
  GetOrganizationById,
} from '@/app/actions/server/orders-actions';

import NotFoundGlobal from '@/app/nav/not-found-global';

import OrdersByIdReceipt from '@/app/features/orders/id/orders-id-receipt';

//start of function
export default async function OrdersByIdReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const order = await GetOrderById(id);
  const defaultOrgId =
    process.env.APP_DEFAULT_ORG_ID || '67d3b82d98e8865f5b172af1';
  const org = await GetOrganizationById(defaultOrgId);

  if (!order) {
    return (
      <NotFoundGlobal display={'Order data not found'} backUrl={'/orders'} />
    );
  }

  return (
    <OrdersByIdReceipt
      org={org}
      order={order}
      showQrCode={true}
      showButtons={'true'}
    />
  );
}
