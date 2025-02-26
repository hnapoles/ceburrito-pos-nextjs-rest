'use client';

import React, { useState } from 'react';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

//import ProductsTableRow from './products-table-row';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { ProductSellingPriceBase } from '@/app/models/products-model';
import ProductsByIdPricesTableRow from './products-id-prices-table-row';

import { ProductsByIdPricesSearchInput } from './products-id-prices-search-input';

export default function ProductsByIdPricesTableSimple({
  productName,
  productId,
  data,
  limit,
  page,
  totalDataCount,
}: {
  productName: string;
  productId: string;
  data: ProductSellingPriceBase[];
  limit: number;
  page: number;
  totalDataCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const rowsPerPage = limit;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    //router.push(`/?offset=${offset}`, { scroll: false });
    router.push(`${pathname}?page=${page + 1}&limit=${limit}`, {
      scroll: false,
    });
  }

  const [toggleCreateDialog, setToggleCreateDialog] = useState<boolean>(false);

  const [toggleEditForm, setToggleEditForm] = useState<boolean>(false);

  const handleClickAddButton = () => {
    router.push(`${pathname}/prices/create`);
  };

  if (!data || data.length <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              <div>Product Selling Prices</div>
              <div className="flex">
                <ProductsByIdPricesSearchInput />
                <Button
                  variant="outline"
                  onClick={() => handleClickAddButton()}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardTitle>
          <CardDescription>{productName}</CardDescription>
        </CardHeader>
        <CardContent>No price records found...</CardContent>
      </Card>
    );
  }

  const [search, setSearch] = useState('');

  const filteredData = data.filter((item) =>
    Object.values(item)
      .filter((value) => typeof value === 'string')
      .some((value) =>
        (value as string).toLowerCase().includes(search.toLowerCase()),
      ),
  );

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              <div>Product Selling Prices</div>
              <div className="flex">
                {/*<ProductsByIdPricesSearchInput />*/}
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mr-2 mb-4"
                />
                <Button
                  variant="outline"
                  onClick={() => handleClickAddButton()}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardTitle>
          <CardDescription>{productName}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Type</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="md:table-cell">Selling Price</TableHead>
                <TableHead className="hidden">Updated By</TableHead>
                <TableHead className="hidden">Updated At</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <ProductsByIdPricesTableRow
                  key={row._id}
                  productPrice={row}
                  productName={productName}
                  productId={productId}
                />
              ))}
            </TableBody>
            <TableBody>
              {toggleEditForm && (
                <TableRow>
                  <TableCell>123</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <form className="flex items-center w-full justify-between">
            <div className="text-xs text-muted-foreground">
              Showing{' '}
              <strong>
                {totalDataCount > 0 ? (page - 1) * rowsPerPage + 1 : 0}-
                {Math.min(page * rowsPerPage, totalDataCount)}
              </strong>{' '}
              of <strong>{totalDataCount}</strong> prices
            </div>
            <div className="flex">
              <Button
                formAction={prevPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={page <= 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <Button
                formAction={nextPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={page * rowsPerPage >= totalDataCount}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
