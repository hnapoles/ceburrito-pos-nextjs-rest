'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { File } from 'lucide-react';

import ProductsTableSimple from './products-table-simple';

import { IProductListProps } from '@/app/models/products-model';

import { ProductSearchInput } from './product-search-input.';

const ProductsMainPage: React.FC<IProductListProps> = ({
  products,
  limit,
  page,
  totalDataCount,
}) => {
  const pathname = usePathname();
  const createLink = `${pathname}/create`;

  return (
    <Tabs defaultValue="all">
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
      <TabsContent value="all">
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
