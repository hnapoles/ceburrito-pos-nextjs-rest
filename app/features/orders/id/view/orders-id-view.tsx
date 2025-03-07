'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import OrdersIdLines from '../edit/orders-id-lines';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatPeso, formatPesoNoDecimals } from '@/app/actions/client/peso';
import { Lookup } from '@/app/models/lookups-model';
import React from 'react';
import { Button } from '@/components/ui/button-rounded-sm';

import KeyboardTouchLettersDialog from '@/app/features/keyboard/keyboard-touch-letters-dialog';
import KeyboardTouchEmailDialog from '@/app/features/keyboard/keyboard-touch-email-dialog';
import { OrderBase } from '@/app/models/orders-model';
import { CreateOrder, UpdateOrder } from '@/app/actions/server/orders-actions';
import { toast } from '@/hooks/use-toast';
import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';

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
  const [order, setOrder] = React.useState(orderData);

  const orderIdWithDashes = `${(order._id || '').slice(0, 4)}-${(
    order._id || ''
  ).slice(4, -4)}-${(order._id || '').slice(-4)}`;

  const lineItemCount = (order.orderLines || [])
    .filter((line) => (line.status ?? 'open') !== 'canceled') // Default status to "open"
    .reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white border border-sm rounded-sm p-4">
      <div className="flex flex-col h-full">
        <div>Order</div>
        <div className="border border-sm rounded-sm p-4 flex-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">Id</span>
            <span className="text-right">
              {orderIdWithDashes.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Order Date</span>
            <span className="text-right">
              {order.orderedAt
                ? new Date(order.orderedAt).toLocaleString()
                : ''}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Store Name</span>
            <span className="text-right">{order.storeName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Order Type</span>
            <span className="text-right">{order.type?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div>Customer</div>
        <div className="border border-sm rounded-sm p-4 flex-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">Customer Name</span>
            <span className="text-right">{order.customerName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Address</span>
            <span className="text-right">...</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Email</span>
            <span className="text-right">{order.customerEmail ?? '...'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Mode</span>
            <span className="text-right">
              {order.mode?.toUpperCase() ?? '...'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <div>Payment</div>
        <div className="border border-sm rounded-sm p-4 flex-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">Payment Method</span>
            <span className="text-right">
              {order.paymentMethod?.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Reference</span>
            <span className="text-right">
              {order.paymentReference ?? 'n/a'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Items</span>
            <span className="text-right">{lineItemCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount</span>
            <span className="text-right">
              {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
