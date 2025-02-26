'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  /*
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={clsx(
            'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
            {
              'bg-accent text-black': pathname === href,
            },
          )}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
  */

  /*
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground p-2 rounded-lg',
        isActive ? 'bg-gray-100 text-white' : 'text-gray-500',
      )}
    >
      {children}
      <span
        className={cn(
          'text-[10px]',
          isActive ? 'text-black' : 'text-black-500',
        )}
      >
        {label}{' '}
      </span>
    </Link>
  );
  */
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground',
            isActive ? 'bg-gray-100 text-black-600' : 'text-black-500',
          )}
        >
          {children}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
