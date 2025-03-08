'use client';

import { useRouter } from 'next/navigation';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button-rounded-sm';

import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import { Lookup } from '@/app/models/lookups-model';
import React from 'react';

import { OrderBase } from '@/app/models/orders-model';

import Image from 'next/image';

export default function OrdersByIdClone({
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
  const router = useRouter();

  console.log(dineModes, paymentMethods, statuses);
  //const [order, setOrder] = React.useState(orderData);
  const order = orderData;

  const orderIdWithDashes = `${(order._id || '').slice(0, 4)}-${(
    order._id || ''
  ).slice(4, -4)}-${(order._id || '').slice(-4)}`;

  const lineItemCount = (order.orderLines || [])
    .filter((line) => (line.status ?? 'open') !== 'canceled') // Default status to "open"
    .reduce((sum, line) => sum + line.quantity, 0);

  const handleSave = async () => {
    router.push(`/orders`);
  };

  return (
    <div className="relative gap-4 bg-white border border-sm rounded-sm p-4">
      {/* grid grid-cols-1 lg:grid-cols-2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        {/* items */}
        <div className="flex flex-col h-full flex-1">
          <div className="flex items-center">
            <p className="text-lg">Items</p>
          </div>
          <div className="border border-sm rounded-sm p-4 flex-1 overflow-auto">
            <Table className="w-full">
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
                    <TableCell>{row.spiceOption || 'n/na'}</TableCell>
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
                <TableRow className="mt-4">
                  <TableCell className="font-medium text-right" colSpan={5}>
                    Total
                  </TableCell>
                  <TableCell className="text-right text-gray-900">
                    {lineItemCount}
                  </TableCell>
                  <TableCell className="text-right text-gray-900">
                    {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        {/* END items */}
        {/* information */}
        <div className="grid grid-cols-1 gap-4">
          {/* order */}
          <div className="flex flex-col h-full">
            <div className="flex items-center">
              <p className="text-lg">Clone Order</p>
            </div>

            <div className="border border-sm rounded-sm p-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">From Id</span>
                <span className="text-right text-gray-900">
                  {orderIdWithDashes.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Date</span>
                <span className="text-right text-gray-900">
                  {order.orderedAt
                    ? new Date(order.orderedAt).toLocaleString()
                    : 'n/a'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                <span className="text-right text-gray-900 ml-2">
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Type</span>
                <span className="text-right text-red-700">{order.type}</span>
              </div>
            </div>
          </div>
          {/* END order */}
          {/* customer */}
          <div className="flex flex-col h-full">
            <div>Customer</div>
            <div className="border border-sm rounded-sm p-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">Customer Name</span>
                <span className="text-right text-gray-900">
                  {order.customerName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Address</span>
                <span className="text-right text-gray-900">n/a</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Email</span>
                <span className="text-right text-gray-900">
                  {order.customerEmail ?? 'n/a'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Mode</span>
                <span className="text-right text-red-700">
                  {order.mode ?? 'n/a'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Store Name</span>
                <span className="text-right text-gray-900">
                  {order.storeName}
                </span>
              </div>
            </div>
          </div>
          {/* END customer */}
          {/* payment */}
          <div className="flex flex-col h-full">
            <div>Payment</div>
            <div className="border border-sm rounded-sm p-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">Payment Method</span>
                <span className="text-right text-gray-900">
                  {order.paymentMethod?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Reference</span>
                <span className="text-right text-gray-900">
                  {order.paymentReference ?? 'n/a'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Items</span>
                <span className="text-right text-gray-900">
                  {lineItemCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-right text-red-700">
                  {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
                </span>
              </div>
            </div>
          </div>
          {/* END payment */}
        </div>
        {/* END information */}
      </div>
      {/* END grid grid-cols-1 lg:grid-cols-2 */}
      <div className="flex items-center justify-end gap-2 mt-2">
        <Button variant="outline" className="w-full md:w-[100px]">
          Cancel
        </Button>
        <Button className="w-full md:w-[100px]" onClick={() => handleSave()}>
          Save
        </Button>
      </div>
    </div>
  );
}
