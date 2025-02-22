'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
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

import ProductPricesContentTableRow from './tab-product-prices-content-table-row';
import TabProductPricesDialogCreate from './tab-product-prices-content-dialog-create';
import TabProductPricesDialogUpdate from './tab-product-prices-content-dialog-update';
import TabProductPricesFormUpdate from './tab-product-price-content-form-create';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { PlusCircle } from 'lucide-react';
import { useDialogStore } from '@/app/providers/zustand-provider';

import { useGlobalStore } from '@/app/providers/zustand-provider';

import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ProductSellingPriceDataBase } from '@/app/models/products-model';
import { GetProductSellingPricesByProductId } from '@/app/actions/server/product-selling-prices-actions';
import { TestComponent } from './test-component';
import Test2 from './test2';

import TabProductPriceContentTopCard from './tab-product-price-content-top-card';

export default function TabProductPricesContentTableSimple({
  limit,
  page,
  totalDataCount,
}: {
  limit: number;
  page: number;
  totalDataCount: number;
}) {
  const [dialogId, setDialogId] = useState<string>('');

  const product = useGlobalStore((state) => state.product);
  //const productSellingPrices = useGlobalStore((state) => state.productSellingPrices);

  const [refresh, setRefresh] = useState<boolean>(false);

  const [prices, setPrices] = useState<ProductSellingPriceDataBase[]>([]);

  const fetchData = useCallback(async () => {
    const res1 = await GetProductSellingPricesByProductId(product?._id || '');
    setPrices(res1.data);
  }, []); // ✅ No dependencies

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const { openCreateDialog } = useDialogStore();

  const router = useRouter();
  const pathname = usePathname();
  const rowsPerPage = 10;

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
    <div className="space-between-10">
      <div>
        {dialogId && (
          <TabProductPriceContentTopCard
            setRefresh={setRefresh}
            dialogId={dialogId}
          />
        )}
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Product Prices{' '}
              <Tooltip>
                <TooltipTrigger>
                  {/*<Button
                  size="sm"
                  className="h-6 gap-1 px-2"
                  onClick={() => {
                    openCreateDialog();
                  }}
                >
                
                  <PlusCircle className="h-3.5 w-3.5" />
                </Button>*/}
                  <Link
                    href="#"
                    passHref
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default link behavior
                      openCreateDialog();
                    }}
                    className="inline-flex items-center justify-center gap-1 px-2 h-6 bg-purple-500 text-white rounded"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-100 text-purple border">
                  Add New Selling Prices
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>Manage product prices.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Type</TableHead>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead className="md:table-cell">Selling Price</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              {prices && prices.length > 0 && (
                <TableBody>
                  {prices.map((row) => (
                    <ProductPricesContentTableRow
                      key={row._id}
                      productPrices={row}
                      setRefresh={setRefresh}
                      setDialogId={setDialogId}
                    />
                  ))}
                </TableBody>
              )}
            </Table>
          </CardContent>
          <CardFooter>
            <form className="flex items-center w-full justify-between">
              <div className="text-xs text-muted-foreground">
                Showing{' '}
                <strong>
                  {Math.max(
                    1,
                    Math.min(limit - rowsPerPage, totalDataCount) + 1,
                  )}
                  -{Math.min(limit, totalDataCount)}
                </strong>{' '}
                of <strong>{totalDataCount}</strong> products
              </div>
              <div className="flex">
                <Button
                  formAction={prevPage}
                  variant="ghost"
                  size="sm"
                  type="submit"
                  disabled={false}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Prev
                </Button>
                <Button
                  formAction={nextPage}
                  variant="ghost"
                  size="sm"
                  type="submit"
                  disabled={limit > totalDataCount}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
        <TabProductPricesDialogCreate setRefresh={setRefresh} />
        {/*<TabProductPricesDialogUpdate
        setRefresh={setRefresh}
        dialogId={dialogId}
      />
      */}
        {dialogId && (
          <div>
            id here: {dialogId}
            <div>
              {' '}
              <TestComponent />{' '}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
