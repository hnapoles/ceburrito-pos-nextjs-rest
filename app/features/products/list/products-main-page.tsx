'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';

import { ProductSearchInput } from './product-search-input.';
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
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Disabled</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <ProductSearchInput />
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          {/* 
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add User
                        </span>
                    </Button>
                    */}
          <Link
            href={createLink}
            className="ml-5 px-2 h-8 lg:flex rounded-md bg-purple-500 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-400"
          >
            Add New
          </Link>
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
