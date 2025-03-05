'use client';

//import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button-rounded-sm';
import { File, PlusCircle } from 'lucide-react';

import { ProductsSearchInput } from './products-search-input.';
import ProductsTableSimple from './products-table-simple';

import { ProductBase } from '@/app/models/products-model';
import { Lookup } from '@/app/models/lookups-model';

interface productListProps {
  products: ProductBase[];
  limit: number | 10;
  page: number | 1;
  totalDataCount: number | 1;
  statusesLookup: Lookup[];
  currentTab: string;
}

const ProductsMainPage: React.FC<productListProps> = ({
  products,
  limit,
  page,
  totalDataCount,
  statusesLookup,
  currentTab,
}) => {
  const pathname = usePathname();
  const createLink = `${pathname}/create`;

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('status', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs defaultValue="all" value={currentTab} onValueChange={handleTabChange}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {statusesLookup.map((item) => (
            <TabsTrigger key={item._id} value={item.lookupValue}>
              {item.lookupDescription}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <ProductsSearchInput />
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>

          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => (window.location.href = createLink)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>

          {/*
          <Link
            href={createLink}
            className="px-2 h-8 lg:flex rounded-md bg-purple-500 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-400"
          >
            Add New
          </Link>
          */}
        </div>
      </div>
      <TabsContent value={currentTab}>
        <ProductsTableSimple
          data={products}
          limit={Number(limit)}
          page={Number(page)}
          totalDataCount={totalDataCount}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProductsMainPage;

/*
<div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
*/
