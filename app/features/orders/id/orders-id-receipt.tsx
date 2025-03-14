'use client';

import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import { OrderBase } from '@/app/models/orders-model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';

interface OrderReceiptProps {
  order: OrderBase;
}

export default function OrdersByIdReceipt({ order }: OrderReceiptProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto p-4 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Order Receipt</CardTitle>
        <p className="text-sm text-gray-500">Order ID: {order._id}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm">
          <p>
            <strong>Customer:</strong> {order.customerName}{' '}
            {order.customerEmail && <span>({order.customerEmail})</span>}
          </p>
          <p>
            <strong>Store:</strong> {order.storeName}
          </p>
          <p>
            <strong>Order Mode:</strong> {order.mode}
          </p>
          <p>
            <strong>Payment:</strong> {order.paymentMethod}{' '}
            {order.paymentReference && <span>({order.paymentReference})</span>}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Ordered At:</strong>{' '}
            {order.orderedAt
              ? format(new Date(order.orderedAt), 'PPpp')
              : 'N/A'}
          </p>
          <p>
            <strong>Total Amount:</strong>{' '}
            {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Spice</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.orderLines?.map((line) => (
              <TableRow
                key={line.productId}
                className={cn(line.status === 'canceled' ? 'hidden' : '')}
              >
                <TableCell className="flex items-center space-x-2">
                  {line.imageUrl && (
                    <Image
                      src={line.imageUrl}
                      alt={line.productName}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <span>{line.productName}</span>
                </TableCell>
                <TableCell>{line.sizeOption || '-'}</TableCell>
                <TableCell>{line.spiceOption || '-'}</TableCell>
                <TableCell className="text-right">{line.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatPesoNoDecimals(Math.floor(line.unitPrice || 0))}
                </TableCell>
                <TableCell className="text-right">
                  {formatPesoNoDecimals(Math.floor(line.amount || 0))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
