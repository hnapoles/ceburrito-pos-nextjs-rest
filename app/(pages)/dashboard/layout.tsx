import { Analytics } from '@vercel/analytics/react';
import { User } from '@/app/layout/nav-user';
import NavProvider from '@/app/provider/nav-provider';
//import { SearchInput } from '@/app/modules/nav/views/search';

import DesktopNav  from '@/app/layout/nav-desktop'
import MobileNav from '@/app/layout/nav-mobile'
import PagesBreadCrumb from '@/app/layout/nav-bread-crumb'

import {
    Home,
    LineChart,
    Package,
    //Package2,
    //PanelLeft,
    //Settings,
    ShoppingCart,
    Users2
  } from 'lucide-react';

export default function PagesDefaultLayout({
  children
}: {
  children: React.ReactNode;
}) {

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


  return (
    <NavProvider>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav navItems={navItems}/>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <PagesBreadCrumb />
            {/*<SearchInput />*/}
            <div className="relative ml-auto flex-1 md:grow-0">
            </div>
            <User />
        
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
          
              {children}
             
          </main>
        </div>
        <Analytics />
        
      </main>
    </NavProvider>
    
  );
}
