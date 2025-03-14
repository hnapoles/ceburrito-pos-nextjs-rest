'use client';

//import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell,
} from '@/components/ui/table';

import {
  Blinds,
  ChevronLeft,
  ChevronRight,
  Copy,
  //Edit,
  MoreHorizontal,
  ReceiptText,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button-rounded-sm';
import { File, PlusCircle } from 'lucide-react';

//import { ProductSearchInput } from './order-search-input.';
//import ProductsTableSimple from './orders-table-simple';

import { OrderBase } from '@/app/models/orders-model';
import { OrdersSearchInput } from './orders-list-search-input';

import { Lookup } from '@/app/models/lookups-model';

import { formatPesoNoDecimals } from '@/app/actions/client/peso';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface orderListProps {
  orders: OrderBase[];
  limit: number | 10;
  page: number | 1;
  totalDataCount: number;
  statusesLookup: Lookup[];
  currentTab: string;
}

const OrdersList: React.FC<orderListProps> = ({
  orders,
  limit,
  page,
  totalDataCount,
  statusesLookup,
  currentTab,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createLink = `/orders/create`;

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
          <OrdersSearchInput />
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 hidden md:flex"
          >
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>

          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => router.push(createLink)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Order
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value={currentTab}>
        <Card className="m-1 md:m-2">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage orders list.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead className="hidden md:table-cell">Mode</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead>Ordered Date</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>

                  <TableHead className="hidden md:table-cell">
                    Payment Method
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Store Name
                  </TableHead>

                  <TableHead className="hidden md:table-cell">
                    Order Id
                  </TableHead>

                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((row) => {
                  const lineItemCount = (row.orderLines || [])
                    .filter((line) => (line.status ?? 'open') !== 'canceled') // Default status to "open"
                    .reduce((sum, line) => sum + line.quantity, 0);

                  return (
                    <TableRow
                      key={row._id}
                      className="hover:pointer-cursor"
                      onClick={() => router.push(`/orders/${row._id}/view`)}
                    >
                      <TableCell className="font-medium">
                        {row.customerName}{' '}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {row.mode}
                      </TableCell>
                      <TableCell>{row._id?.slice(-4).toUpperCase()}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {row.status}
                      </TableCell>
                      <TableCell>
                        {row.orderedAt
                          ? new Date(row.orderedAt).toLocaleString()
                          : 'n/a'}
                      </TableCell>
                      <TableCell className="text-right">
                        {lineItemCount}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPesoNoDecimals(Math.floor(row.totalAmount || 0))}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {row.paymentMethod?.toUpperCase()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {row.storeName}
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {`${(row._id || '').slice(0, 4)}-${(
                          row._id || ''
                        ).slice(4, -4)}-${(row._id || '').slice(
                          -4,
                        )}`.toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <MoreHorizontal className="h-4 w-4 text-blue-900" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Separator />
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/orders/${row._id}/receipt`)
                              }
                            >
                              <ReceiptText className="mr-1 h-4 w-4" />
                              View Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={row.status === 'open' ? '' : 'hidden'}
                            >
                              <RefreshCw className="mr-1 h-4 w-4" />
                              Close Order
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/orders/${row._id}/clone`)
                              }
                            >
                              <Copy className="mr-1 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className={row.status === 'open' ? '' : 'hidden'}
                            >
                              <Trash2 className="mr-1 h-4 w-4 text-red-600" />
                              Cancel Order
                            </DropdownMenuItem>

                            <Separator />
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/orders/${row._id}/view`)
                              }
                            >
                              <Blinds className="mr-1 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                of <strong>{totalDataCount}</strong> orders
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
      </TabsContent>
    </Tabs>
  );
};

export default OrdersList;
