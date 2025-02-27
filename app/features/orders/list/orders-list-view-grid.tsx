'use client';
import React from 'react';

import { useRouter } from 'next/navigation';

import { OrderBase } from '@/app/models/orders-model';
import { Lookup } from '@/app/models/lookups-model';

import {
  Card,
  CardContent,
  CardFooter,
  //CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPeso } from '@/app/actions/client/peso';
import { Button } from '@/components/ui/button';
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

interface orderGridViewProps {
  orders: OrderBase[];
  totalDataCount?: number | 1;
  statusesLookup?: Lookup[];
}

const OrdersListViewGrid: React.FC<orderGridViewProps> = ({ orders }) => {
  if (!orders) {
    return <div>No orders found...</div>;
  }

  const [selectedOrder, setSelectedOrder] = React.useState<OrderBase | null>(
    null,
  );

  const router = useRouter();

  async function markOrderAsClosed() {
    if (selectedOrder) {
      let newData: OrderBase = {
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
      revalidateAndRedirectUrl('/orders');
    }
  }

  return (
    <div className="container mx-auto lg:p-4 md:p-2 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {orders.map((order) => (
          <Link href={`/orders/${order._id}`} key={order._id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {order.customerName || '******'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {order._id?.slice(-4).toUpperCase()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {order._id?.slice(0, 4)}-{order._id?.slice(4, -4)}-
                  {order._id?.slice(-4)}
                </p>
                <div className="text-2xl font-bold">
                  {formatPeso(order.totalAmount || 0.0)}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full gap-1 flex"
                  onClick={(e) => {
                    e.preventDefault(); // Prevents navigation
                    e.stopPropagation(); // Stops Card click
                    setSelectedOrder(order);
                  }}
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Mark as Closed
                  </span>
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
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
