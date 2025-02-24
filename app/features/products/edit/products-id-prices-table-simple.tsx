'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

//import ProductsTableRow from './products-table-row';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { ProductSellingPriceBase } from '@/app/models/products-model';
import ProductsByIdPricesTableRow from './products-id-prices-table-row';

export default function ProductsByIdPricesTableSimple({
  data,
  limit,
  page,
  totalDataCount,
}: {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Selling Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Type</TableHead>
              <TableHead>Store Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead className="md:table-cell">Selling Price</TableHead>
              <TableHead className="hidden">Updated By</TableHead>
              <TableHead className="hidden">Updated At</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <ProductsByIdPricesTableRow key={row._id} productPrice={row} />
            ))}
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
  );
}
