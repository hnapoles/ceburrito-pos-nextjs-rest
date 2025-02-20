import Link from 'next/link';
import {
  Home,
  LineChart,
  Package,
  //Package2,
  //PanelLeft,
  Settings,
  ShoppingCart,
  Users2
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { VercelLogo } from '../icons/icons';
import { NavItem } from './nav-item';

//import { HeroIconNamed } from '@/components/icons/hero-icon-named'
//import { HomeIcon } from '@heroicons/react/24/outline';

const navItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        iconName: Home
    },
    {
      title: "Orders",
      href: "/orders",
      iconName: ShoppingCart
    },
    {
      title: "Products",
      href: "/products",
      iconName: Package
    },
    {
      title: "Customers",
      href: "/customers",
      iconName: Users2
    },
    {
      title: "Analytics",
      href: "/analytics",
      iconName: LineChart
    }
]

export default function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <VercelLogo className="h-3 w-3 transition-all group-hover:scale-110" />
          <span className="sr-only">Acme Inc</span>
        </Link>

        {navItems.map( (item) => (
          
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
