'use client';

import { useTransition } from 'react';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
//import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { Spinner } from '@/app/styles/icons';
import { Search } from 'lucide-react';

export function OrdersCreatePosSearchInput() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  function searchAction(formData: FormData) {
    const value = formData.get('keyword') as string;
    const params = new URLSearchParams({ keyword: value });
    startTransition(() => {
      //router.replace(`/dashboard/settings/users?${params.toString()}`);
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      {/*<Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />*/}
      <Input
        name="keyword"
        type="search"
        placeholder="Search..."
        defaultValue={searchParams.get('keyword')?.toString()}
        className="w-full rounded-lg bg-background pl-8 md:w-[100px] lg:w-[150px]"
      />
      {isPending && <Spinner />}
    </form>
  );
}
