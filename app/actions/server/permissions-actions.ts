'use server';

import { auth } from '@/auth';

export async function IsUserPermissionLevelAllowed(level: string) {
  const session = await auth();
  if (session?.user.primaryRole) {
    if (level === session.user.primaryRole) return true;
    return false;
  }

  return false;
}
