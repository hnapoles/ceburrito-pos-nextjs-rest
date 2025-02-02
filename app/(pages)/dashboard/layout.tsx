
import { Analytics } from '@vercel/analytics/react';
import { User } from '@/app/modules/nav/views/user';
import NavProvider from '@/app/modules/nav/providers/nav-provider';
//import { SearchInput } from '@/app/modules/nav/views/search';

import DesktopNav from '@/app/modules/nav/views/desktop-nav'
import MobileNav from '@/app/modules/nav/views/mobile-nav'
import PagesBreadCrumb from '@/app/modules/nav/views/pages-bread-crumb'

import ServerErrorDialog from '@/app/providers/server-error-dialog';
import { ErrorProvider } from '@/app/providers/error-context';

export default function PagesDefaultLayout({
  children
}: {
  children: React.ReactNode;
}) {

  


  return (
    <NavProvider>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
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
