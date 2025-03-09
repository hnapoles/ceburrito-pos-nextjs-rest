import { redirect } from 'next/navigation';

export default async function OrdersByIdPage() {
  redirect(`/orders/list`);
}
