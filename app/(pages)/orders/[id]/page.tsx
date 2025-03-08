import { redirect } from 'next/navigation';

export default async function OrdersByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  redirect(`/orders/${id}/view`);
}
