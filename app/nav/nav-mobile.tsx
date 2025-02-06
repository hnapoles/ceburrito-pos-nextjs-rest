'use client'

import { useState } from 'react';

import Link from 'next/link';
import {
  //Home,
  //LineChart,
  //Package,
  Package2,
  PanelLeft,
  Settings,
  //ShoppingCart,
  //Users2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import { listNavItems } from '@/app/model/nav-model';

const MobileNav: React.FC = () => {

    const [openSheet, setOpenSheet] = useState(false);
  
    return (
      <Sheet  open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
       
        
        <SheetContent side="left" className="sm:max-w-xs">
        
       
          {/** do not remove code below - this is to fix bug 
           * Shadcn `DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users
           * **/}
          <SheetHeader className="sr-only">
                        <SheetTitle className="sr-only">Sidebar</SheetTitle>
           <SheetDescription className="sr-only">Sidebar</SheetDescription>
          </SheetHeader>
           {/** do not remove code above **/}
         
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Ceburrito</span>
            </Link>

            {listNavItems.map( (item) => (
                  <Link 
                    href={item.href} 
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" key={item.title}
                    onClick={() => {setOpenSheet(false)} }
                  >
                    <item.iconName
                        className="h-5 w-5 text-black" />
                        
                    {item.title}
                  </Link>
            ))}
            
            <Link
              href="/settings"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => {setOpenSheet(false)} }
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    );
}

export default MobileNav
