import { Analytics } from '@vercel/analytics/react';
import { User } from '@/app/nav/nav-user';
import NavProvider from '@/app/providers/nav-provider';
//import { SearchInput } from '@/app/modules/nav/views/search';

import DesktopNav from '@/app/nav/nav-desktop';
import MobileNav from '@/app/nav/nav-mobile';
import PagesBreadCrumb from '@/app/nav/nav-bread-crumb';

import StoreSelectionModal from '../features/stores/select/store-selection-for-local-storage';
import { auth } from '@/auth';

export default async function DashboardDefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;
  return (
    <NavProvider>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col gap-1 lg:gap-1 md:py-1 py-1 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <PagesBreadCrumb />
            {/*<SearchInput />*/}
            <div className="relative ml-auto flex-1 md:grow-0"></div>
            <User
              user={user ? { image: user.image ?? undefined } : undefined}
            />
          </header>
          <main className="grid flex-1 items-start gap-2 p-0 sm:px-0 sm:py-0 md:gap-4 bg-muted/40">
            {children}
            <StoreSelectionModal />
          </main>
        </div>
        <Analytics />
      </main>
    </NavProvider>
  );
}
