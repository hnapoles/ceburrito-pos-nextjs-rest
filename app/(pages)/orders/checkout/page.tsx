import { redirect } from 'next/navigation';

export default async function OrdersCheckoutPage({
  params,
}: {
  params: Promise<{ orderType: string }>;
}) {
  const orderType = (await params).orderType ?? 'pos';
  redirect(`/orders/checkout/${orderType}`);
}
