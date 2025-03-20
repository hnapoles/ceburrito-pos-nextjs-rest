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

import { storeColorClasses } from '../models/organizations-model';

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
            storeColorClasses[storeColor || 'purple'] || 'bg-purple-500', // Fallback for safety
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
