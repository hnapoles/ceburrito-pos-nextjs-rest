'use client';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function NavProvider({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
