// pages/grid.tsx
import React from 'react';
//import Image from 'next/image';

import { OrderBase } from '@/app/models/orders-model';
import { Lookup } from '@/app/models/lookups-model';

import {
  Card,
  CardContent,
  //CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPeso } from '@/app/actions/client/peso';

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
          <Card key={order._id}>
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersListViewGrid;
