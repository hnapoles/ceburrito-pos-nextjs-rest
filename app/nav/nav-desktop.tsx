'use client';

import Link from 'next/link';

//import Image from 'next/image'
import { SquareDashedMousePointer } from 'lucide-react';
//import { VercelLogo } from '../styles/icons';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { NavItem } from './nav-item';

import { listNavItems, listAppItems } from '@/app/models/nav-model';
import { useStoreName } from '../providers/zustand-provider';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button-rounded-sm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const DesktopNav: React.FC = () => {
  /*
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />

          <span className="sr-only">Ceburrito.ph</span>
        </Link>

        {listNavItems.map((item) => (
          <NavItem href={item.href} label={item.title} key={item.title}>
            <item.iconName className="h-5 w-5 text-black" />
          </NavItem>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
  */

  const storeColorClasses: Record<string, string> = {
    'slate-500': 'bg-slate-500',
    'gray-500': 'bg-gray-500',
    'zinc-500': 'bg-zinc-500',
    'neutral-500': 'bg-neutral-500',
    'stone-500': 'bg-stone-500',
    'red-500': 'bg-red-500',
    'orange-500': 'bg-orange-500',
    'amber-500': 'bg-amber-500',
    'yellow-500': 'bg-yellow-500',
    'lime-500': 'bg-lime-500',
    'green-500': 'bg-green-500',
    'emerald-500': 'bg-emerald-500',
    'teal-500': 'bg-teal-500',
    'cyan-500': 'bg-cyan-500',
    'sky-500': 'bg-sky-500',
    'blue-500': 'bg-blue-500',
    'indigo-500': 'bg-indigo-500',
    'violet-500': 'bg-violet-500',
    'purple-500': 'bg-purple-500',
    'fuchsia-500': 'bg-fuchsia-500',
    'pink-500': 'bg-pink-500',
    'rose-500': 'bg-rose-500',
  };

  const { storeName, storeColor } = useStoreName();
  const router = useRouter();

  console.log(storeColor);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className={cn(
            'group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-10 md:w-10 md:text-base',
            storeColorClasses[storeColor || 'purple-500'] || 'bg-purple-500', // Fallback for safety
          )}
        >
          {/*<VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />*/}
          {storeName
            ?.split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .join('')}
          <span className="sr-only">Ceburrito.ph</span>
        </Link>

        {listNavItems.map((item) => (
          <NavItem href={item.href} label={item.title} key={item.title}>
            <div className="flex flex-col items-center justify-center text-center">
              <item.iconName className="h-5 w-5 text-black" />
              <span className="text-[10px] mt-1">{item.title}</span>
            </div>
          </NavItem>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            {/*<Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <SquareDashedMousePointer className="h-5 w-5" />
              <span className="sr-only">Switch To</span>
            </Link>*/}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  variant="ghost"
                  className="flex h-9 w-9 flex-col items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                >
                  <SquareDashedMousePointer className="h-5 w-5 text-black" />
                  <span className="hidden">Switch To</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>More Apps</DropdownMenuLabel>
                <Separator />

                {listAppItems.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    onClick={() => router.push(item.href)}
                    className="flex items-center gap-4 px-2.5  hover:text-foreground cursor-pointer"
                  >
                    <item.iconName className="h-5 w-5 text-black" />
                    {item.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent side="right">Switch To</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
};

export default DesktopNav;
