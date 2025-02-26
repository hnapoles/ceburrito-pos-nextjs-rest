// pages/grid.tsx
import React from 'react';
//import Image from 'next/image';

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

interface orderGridViewProps {
  orders: OrderBase[];
  totalDataCount?: number | 1;
  statusesLookup?: Lookup[];
}

const OrdersListViewGrid: React.FC<orderGridViewProps> = ({ orders }) => {
  if (!orders) {
    return <div>No orders found...</div>;
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
                    console.log('Button clicked');
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
    </div>
  );
};

export default OrdersListViewGrid;
