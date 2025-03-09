'use client';
import React from 'react';

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import { Lookup } from '@/app/models/lookups-model';

import { OrderBase } from '@/app/models/orders-model';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserWhoProps } from '@/app/models/users-model';
import { WhoTabContent } from '@/app/nav/who-tab-content';
import Image from 'next/image';
import {
  Copy,
  Edit,
  MoreHorizontal,
  ReceiptText,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function OrdersByIdView({
  orderData,
}: {
  orderData: OrderBase;
}) {
  const router = useRouter();

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

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative gap-4 bg-white border border-sm rounded-sm p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-col h-full">
          <div className="flex items-center">
            <p className="text-base font-semibold">View Order</p>
          </div>
          <div
            className="border border-sm rounded-sm p-4 flex-1 cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">Id</span>
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
            <div className="flex justify-end">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4 text-blue-900" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <Separator />
                  <DropdownMenuItem
                    onClick={() => router.push(`/orders/${order._id}/receipt`)}
                  >
                    <ReceiptText className="mr-1 h-4 w-4" />
                    View Receipt
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={order.status === 'open' ? '' : 'hidden'}
                  >
                    <RefreshCw className="mr-1 h-4 w-4" />
                    Close Order
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push(`/orders/${order._id}/clone`)}
                  >
                    <Copy className="mr-1 h-4 w-4" /> Duplicate
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className={order.status === 'open' ? '' : 'hidden'}
                  >
                    <Trash2 className="mr-1 h-4 w-4 text-red-600" />
                    Cancel Order
                  </DropdownMenuItem>

                  <Separator />
                  <DropdownMenuItem
                    onClick={() => router.push(`/orders/${order._id}/edit`)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="text-base font-semibold">Customer</div>
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

        <div className="flex flex-col h-full">
          <div className="text-base font-semibold">Payment</div>
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
              <span className="text-right text-gray-900">{lineItemCount}</span>
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
      <Tabs defaultValue="items" className="mt-2 ml-0">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <div className="border border-sm rounded-sm p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Spice</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>{row.status || 'open'}</TableCell>
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
                  <TableCell className="font-medium text-right" colSpan={6}>
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
        </TabsContent>
        <TabsContent value="history">
          <WhoTabContent who={who} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
