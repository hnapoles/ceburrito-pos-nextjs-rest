'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell,
} from '@/components/ui/table';

import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import { Lookup } from '@/app/models/lookups-model';
import React from 'react';

import { OrderBase } from '@/app/models/orders-model';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserWhoProps } from '@/app/models/users-model';
import { WhoTabContent } from '@/app/nav/who-tab-content';
import Image from 'next/image';

export default function OrdersByIdView({
  dineModes,
  paymentMethods,
  statuses,
  orderData,
}: {
  dineModes: Lookup[];
  paymentMethods: Lookup[];
  statuses: Lookup[];
  orderData: OrderBase;
}) {
  console.log(dineModes, paymentMethods, statuses);
  //const [order, setOrder] = React.useState(orderData);
  const order = orderData;

  const orderIdWithDashes = `${(order._id || '').slice(0, 4)}-${(
    order._id || ''
  ).slice(4, -4)}-${(order._id || '').slice(-4)}`;

  const lineItemCount = (order.orderLines || [])
    .filter((line) => (line.status ?? 'open') !== 'canceled') // Default status to "open"
    .reduce((sum, line) => sum + line.quantity, 0);

  const who: UserWhoProps = {
    createdBy: order?.createdBy,
    createdAt: order?.createdAt ? new Date(order.createdAt) : undefined,
    updatedBy: order?.updatedBy,
    updatedAt: order?.updatedAt ? new Date(order.updatedAt) : undefined,
  };

  //setOrder(orderData);

  return (
    <div className="gap-4 bg-white border border-sm rounded-sm p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-col h-full">
          <div>Order</div>
          <div className="border border-sm rounded-sm p-4 flex-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">Id</span>
              <span className="text-right text-blue-700">
                {orderIdWithDashes.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Date</span>
              <span className="text-right text-blue-700">
                {order.orderedAt
                  ? new Date(order.orderedAt).toLocaleString()
                  : ''}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Store Name</span>
              <span className="text-right text-blue-700">
                {order.storeName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Type</span>
              <span className="text-right text-red-700">{order.type}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div>Customer</div>
          <div className="border border-sm rounded-sm p-4 flex-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">Customer Name</span>
              <span className="text-right text-blue-700">
                {order.customerName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Address</span>
              <span className="text-right text-blue-700">...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Email</span>
              <span className="text-right text-blue-700">
                {order.customerEmail ?? '...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Mode</span>
              <span className="text-right text-red-700">
                {order.mode ?? '...'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div>Payment</div>
          <div className="border border-sm rounded-sm p-4 flex-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Method</span>
              <span className="text-right text-blue-700">
                {order.paymentMethod?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Reference</span>
              <span className="text-right text-blue-700">
                {order.paymentReference ?? 'n/a'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Items</span>
              <span className="text-right text-blue-700">{lineItemCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount</span>
              <span className="text-right text-red-700">
                {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="items" className="w-full mt-2 ml-0">
        <TabsList className="grid w-[200px] grid-cols-2">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <Table className="w-full md:w-1/2">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Spice</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderLines?.map((row, index) => (
                <TableRow key={index}>
                  {' '}
                  {/* ✅ Ensure unique key */}
                  <TableCell>
                    {row.imageUrl ? (
                      <Image
                        alt="User image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={row.imageUrl}
                        width="64"
                      />
                    ) : null}
                  </TableCell>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.sizeOption}</TableCell>
                  <TableCell>{row.spiceOption}</TableCell>
                  <TableCell className="text-right">
                    {formatPesoNoDecimals(Math.floor(row.unitPrice || 0))}
                  </TableCell>
                  <TableCell className="text-right">{row.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatPesoNoDecimals(
                      Math.floor(row.unitPrice * row.quantity || 0),
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="history">
          <WhoTabContent who={who} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
