'use client';
import React from 'react';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { OrderBase } from '@/app/models/orders-model';
import { Lookup } from '@/app/models/lookups-model';

import {
  Card,
  CardContent,
  CardFooter,
  //CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import { Button } from '@/components/ui/button-rounded-sm';
import { RotateCw } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UpdateOrder } from '@/app/actions/server/orders-actions';
import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import ErrorDisplay from '../../error/error-display';

interface orderGridViewProps {
  orders: OrderBase[];
  limit: number;
  page: number;
  totalDataCount: number;
  statusesLookup?: Lookup[];
}

const OrdersListViewGrid: React.FC<orderGridViewProps> = ({
  orders,
  limit,
  page,
  totalDataCount,
}) => {
  const [selectedOrder, setSelectedOrder] = React.useState<OrderBase | null>(
    null,
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  async function markOrderAsClosed() {
    if (selectedOrder) {
      const newData: OrderBase = {
        ...selectedOrder,
        status: 'closed',
      };
      const updatedData = await UpdateOrder(newData);

      toast({
        title: 'Update success',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(updatedData, null, 2)}
            </code>
          </pre>
        ),
      });
      setSelectedOrder(null);
      revalidateAndRedirectUrl(`${pathname}?${searchParams}`);
    }
  }

  if (!orders) {
    return (
      <ErrorDisplay
        message={'No orders found'}
        type={'empty'}
        className={'bg-none'}
      />
    );
  }

  return (
    <div className="container lg:p-4 md:p-2 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 auto-rows-fr">
        {orders.map((order) => (
          <Link
            href={`/orders/${order._id}`}
            key={order._id}
            className="h-full"
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div>
                    {order.customerName || '******'}
                    <Badge
                      variant="outline"
                      className="ml-2 text-xs text-muted-foreground"
                    >
                      {order.mode}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {order._id?.slice(-4).toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order._id?.slice(0, 4)}-{order._id?.slice(4, -4)}-
                  {order._id?.slice(-4)}
                </div>

                <div className="text-2xl font-bold">
                  {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
                  <span className="text-xs">
                    .{order?.totalAmount?.toFixed(2).toString().split('.')[1]}{' '}
                  </span>
                </div>
                <div>
                  {order.storeName}
                  <Badge variant="secondary">{order.type}</Badge>
                </div>
                <p className="text-xs">
                  {order.orderedAt
                    ? new Date(order.orderedAt).toLocaleString()
                    : ''}
                </p>
                <Badge variant="secondary">{order.status}</Badge>
              </CardContent>
              {order.status !== 'closed' && (
                <CardFooter>
                  <Button
                    className={cn(
                      'w-full gap-1',
                      order.status === 'xclosed' ? 'hidden' : 'flex',
                    )}
                    onClick={(e) => {
                      e.preventDefault(); // Prevents navigation
                      e.stopPropagation(); // Stops Card click
                      setSelectedOrder(order);
                    }}
                    disabled={order.status !== 'open'}
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Mark as Closed
                    </span>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </Link>
        ))}
      </div>
      <form className="flex items-center w-full justify-between">
        <div className="text-xs text-muted-foreground">
          Showing{' '}
          <strong>
            {totalDataCount > 0 ? (page - 1) * rowsPerPage + 1 : 0}-
            {Math.min(page * rowsPerPage, totalDataCount)}
          </strong>{' '}
          of <strong>{totalDataCount}</strong> products
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
      {/* Dialog outside the loop */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedOrder(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to close order{' '}
              <strong>{selectedOrder?._id?.slice(-4).toUpperCase()}</strong> for{' '}
              <strong>{selectedOrder?.customerName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Cancel
            </Button>
            <Button onClick={() => markOrderAsClosed()}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersListViewGrid;
