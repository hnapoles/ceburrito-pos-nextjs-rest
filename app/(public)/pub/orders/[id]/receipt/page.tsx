import {
  GetOrderByIdForPublic,
  GetOrganizationByIdForPublic,
} from '@/app/actions/server/orders-actions';

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
    showButtons: string;
  }>;
}) {
  const id = (await params).id;
  const pubKey = (await searchParams).pubKey || 'no-key';
  const showButtons = (await searchParams).showButtons || undefined;

  const order = await GetOrderByIdForPublic(id, pubKey);
  const defaultOrgId =
    process.env.APP_DEFAULT_ORG_ID || '67d3b82d98e8865f5b172af1';
  const org = await GetOrganizationByIdForPublic(defaultOrgId, defaultOrgId);

  if (!order) {
    return (
      <NotFoundGlobal display={'Order data not found'} backUrl={'/orders'} />
    );
  }

  return (
    <OrdersByIdReceipt
      org={org}
      order={order}
      showQrCode={false}
      showButtons={showButtons}
    />
  );
}
