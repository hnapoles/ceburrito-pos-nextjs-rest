import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { formatPeso, formatPesoNoDecimals } from '@/app/actions/client/peso';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button-rounded-sm';

import { OrderBase, OrderLineBase } from '@/app/models/orders-model';
import { Minus, Plus, Trash, Loader2 } from 'lucide-react';
import { UpdateOrder } from '@/app/actions/server/orders-actions';
import { toast } from '@/hooks/use-toast';
import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { Separator } from '@/components/ui/separator';

export default function OrdersIdLines({
  orderType,
  onCheckout = false,
  orderLines,
  totalAmount,
  order,
  setOrder,
}: {
  orderType: string;
  onCheckout?: boolean;
  orderLines: OrderLineBase[];
  totalAmount: number;
  order: OrderBase;
  setOrder: React.Dispatch<React.SetStateAction<OrderBase>>;
}) {
  console.log(orderType);
  const searchParams = useSearchParams();
  const query = new URLSearchParams(searchParams);
  const router = useRouter();
  //const pathname = usePathname();

  // Sort by productName (case-insensitive)
  const sortedData = orderLines.sort((a, b) =>
    a.productName.localeCompare(b.productName),
  );

  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const [loadingItems, setLoadingItems] = React.useState<
    Record<string, boolean>
  >({});

  const handleCancelLine = async (line: OrderLineBase) => {
    const lineKey = `${line.productId}-${line.sizeOption}-${line.spiceOption}`;

    setLoadingItems((prev) => ({ ...prev, [lineKey]: true })); // Start loading
    const existingIndex = orderLines.findIndex(
      (orderLine) =>
        orderLine.productName === line.productName &&
        orderLine.sizeOption === line.sizeOption &&
        orderLine.spiceOption === line.spiceOption &&
        orderLine.status === line.status,
    );

    if (existingIndex !== -1) {
      const updatedOrderLines = [...orderLines];
      const existingOrder = updatedOrderLines[existingIndex];

      updatedOrderLines[existingIndex] = {
        ...existingOrder,
        status: 'canceled',
      };

      const updatedData = order;
      updatedData.totalAmount = (updatedData.totalAmount || 0) - line.amount;
      updatedData.orderLines = updatedOrderLines;

      await UpdateOrder(updatedData);

      toast({
        title: 'Line canceled',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{`Data : ${line.productName}, ${line.sizeOption}, ${line.spiceOption}`}</code>
          </pre>
        ),
      });

      await revalidateAndRedirectUrl(`/orders/${order._id}`);
    } else {
      console.log('not found - can not cancel');
    }
    setLoadingItems((prev) => ({ ...prev, [lineKey]: false })); // Stop loading
  };

  async function handleChangeQty(line: OrderLineBase, action: string) {
    const lineKey = `${line.productId}-${line.sizeOption}-${line.spiceOption}`;

    setLoadingItems((prev) => ({ ...prev, [lineKey]: true })); // Start loading

    try {
      const existingIndex = orderLines.findIndex(
        (orderLine) =>
          orderLine.productName === line.productName &&
          orderLine.sizeOption === line.sizeOption &&
          orderLine.spiceOption === line.spiceOption &&
          orderLine.status === line.status,
      );

      let totalAmount = order.totalAmount;
      if (existingIndex !== -1) {
        const updatedOrderLines = [...orderLines];
        const existingOrder = updatedOrderLines[existingIndex];

        if (action === 'add') {
          updatedOrderLines[existingIndex] = {
            ...existingOrder,
            quantity: existingOrder.quantity + 1,
            amount: existingOrder.amount + line.unitPrice,
          };
          totalAmount = (order.totalAmount || 0) + line.unitPrice;
        } else if (action === 'subtract') {
          if (line.quantity === 1) {
            updatedOrderLines[existingIndex] = {
              ...existingOrder,
              status: 'canceled',
            };
          } else {
            updatedOrderLines[existingIndex] = {
              ...existingOrder,
              quantity: existingOrder.quantity - 1,
              amount: existingOrder.amount - line.unitPrice,
            };
          }
          totalAmount = (order.totalAmount || 0) - line.unitPrice;
        }

        const updatedData = {
          ...order,
          totalAmount: totalAmount,
          orderLines: updatedOrderLines,
        };

        await UpdateOrder(updatedData);

        toast({
          title: 'Line updated',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{`Data : ${line.productName}, ${line.sizeOption}, ${line.spiceOption}`}</code>
            </pre>
          ),
        });

        setOrder(updatedData);
        //await revalidateAndRedirectUrl(pathname);
        //router.refresh(); // ✅ Forces a fresh fetch from the server
        query.set('refresh', Date.now().toString()); // Change URL to trigger a refresh
        router.push(`?${query.toString()}`);
      } else {
        console.log('Order line not found - cannot update');
      }
    } catch (error) {
      console.error('Error updating order line:', error);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [lineKey]: false })); // Stop loading (always runs)
    }
  }

  const itemsCount = (order.orderLines || [])
    .filter((line) => (line.status ?? 'open') !== 'canceled') // Default status to "open"
    .reduce((sum, line) => sum + line.quantity, 0);

  const orderIdWithDashes = `${(order._id || '').slice(0, 4)}-${(
    order._id || ''
  ).slice(4, -4)}-${(order._id || '').slice(-4)}`;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Order</CardTitle>

        <div className="border border-sm rounded-sm p-4 flex-1 cursor-pointer hover:bg-gray-100 transition">
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
            <span className="font-medium">Store Name</span>
            <span className="text-right text-gray-900 ml-2">
              {order.storeName || ''}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Order Type</span>
            <span className="text-right text-red-700">{order.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Items ({itemsCount})</span>
            <span className="text-right text-red-700">
              {formatPesoNoDecimals(Math.floor(totalAmount))}
            </span>
          </div>
        </div>

        {/*onCheckout && order.status === 'open' ? (
          <Button
            className="w-full"
            onClick={() => {
              router.push(`/orders/${order._id}/addItems`);
            }}
          >
            Add More Items
          </Button>
        ) : (
          <Separator />
        )*/}
      </CardHeader>
      <CardContent>
        {sortedData.map((l) => (
          <div key={l.productId + l.sizeOption + l.spiceOption}>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-left gap-1 grid-auto-rows-fr">
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredItem(l.productId)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Product Image */}
                  <Image
                    src={
                      l.imageUrl || '/images/products/no-image-for-display.webp'
                    }
                    alt="image"
                    width={100}
                    height={100}
                    className="h-auto w-auto aspect-square object-cover transition-all hover:scale-105"
                  />

                  {/* CANCELED Overlay */}
                  {l.status === 'canceled' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                      <span className="text-white text-sm font-bold">
                        CANCELED
                      </span>
                    </div>
                  )}

                  {/* Delete Button (Shown on Hover) */}
                  {hoveredItem === l.productId &&
                    l.status !== 'canceled' &&
                    order.status === 'open' && (
                      <Button
                        className="absolute top-1 right-1 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition"
                        size="icon"
                        onClick={() => handleCancelLine(l)}
                        disabled={
                          loadingItems[
                            `${l.productId}-${l.sizeOption}-${l.spiceOption}`
                          ]
                        }
                      >
                        {loadingItems[
                          `${l.productId}-${l.sizeOption}-${l.spiceOption}`
                        ] ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Trash size={16} />
                        )}
                      </Button>
                    )}
                </div>
                <div className="col-span-3 ml-0">
                  <div>
                    <strong>{l.productName}</strong>
                  </div>
                  {formatPesoNoDecimals(Math.floor(l.quantity * l.unitPrice))}
                  <span className="text-xs mr-2">
                    .
                    {
                      (l.quantity * l.unitPrice)
                        .toFixed(2)
                        .toString()
                        .split('.')[1]
                    }
                  </span>
                  <Badge variant="outline" className="border-blue-300">
                    {l.sizeOption}
                  </Badge>{' '}
                  {l.spiceOption && (
                    <Badge variant="outline" className="border-red-500">
                      {l.spiceOption}
                    </Badge>
                  )}
                  <div className="text-xs">
                    ( {formatPeso(l.unitPrice)} / item )
                  </div>
                  <div
                    className={cn(
                      'text-xs',
                      order.status === 'open' && l.status !== 'canceled'
                        ? 'hidden'
                        : 'mt-3',
                    )}
                  >
                    {l.quantity} item(s)
                  </div>
                  <div
                    className={cn(
                      'mt-0 flex',
                      order.status === 'open' && l.status !== 'canceled'
                        ? ''
                        : 'hidden',
                    )}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleChangeQty(l, 'subtract')}
                      className="rounded-none"
                      size="icon"
                      disabled={
                        loadingItems[
                          `${l.productId}-${l.sizeOption}-${l.spiceOption}`
                        ]
                      } // Disable button when loading
                    >
                      {loadingItems[
                        `${l.productId}-${l.sizeOption}-${l.spiceOption}`
                      ] ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Minus />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-none"
                      size="icon"
                    >
                      {l.quantity}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleChangeQty(l, 'add')}
                      className="rounded-none"
                      size="icon"
                      disabled={
                        loadingItems[
                          `${l.productId}-${l.sizeOption}-${l.spiceOption}`
                        ]
                      } // Disable button when loading
                    >
                      {loadingItems[
                        `${l.productId}-${l.sizeOption}-${l.spiceOption}`
                      ] ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Plus />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex w-full mt-auto"></CardFooter>
    </Card>
  );
}
