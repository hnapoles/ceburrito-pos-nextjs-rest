import Link from 'next/link';

import Image from 'next/image'
import {
  Settings,
} from 'lucide-react';

import { LucideIcon } from "lucide-react";

import * as LucideIcons from "lucide-react";


import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { VercelLogo } from './icons';
import { NavItem } from './nav-item';

import { listNavItems } from '@/app/model/nav-model';

const DesktopNav: React.FC = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/dashboard"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          {/*<VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />*/}
          
          <span className="sr-only">Ceburrito.ph</span>
        </Link>

        {listNavItems.map( (item) => (
          
         <div key={item.title}>
          <NavItem href={item.href} label={item.title}>
            <item.iconName
                className="h-5 w-5 text-black" />
          </NavItem>
        </div> 

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
}

export default DesktopNav