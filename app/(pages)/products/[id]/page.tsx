'use client';

import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function RedirectProductsId() {
  const pathname = usePathname();
  redirect(`${pathname}/view`);
}
