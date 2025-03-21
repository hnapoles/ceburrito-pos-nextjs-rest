'use client';

import { useTransition } from 'react';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
//import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';
import { Spinner } from '@/app/styles/icons';
import { Search } from 'lucide-react';

export function SearchInput() {
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

  /*
  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
   
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('keyword', term);
    } else {
      params.delete('keyword');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 3000);
  */

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="keyword"
        type="search"
        placeholder="Search..."
        defaultValue={searchParams.get('keyword')?.toString()}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
      {isPending && <Spinner />}
    </form>
  );
}
