'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function revalidateAndRedirectUrl(url: string) {
  await revalidatePath(url);
  await redirect(url);
}
