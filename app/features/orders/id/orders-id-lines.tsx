import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useCartStore, useStore } from '@/app/providers/zustand-provider';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { formatPeso, formatPesoNoDecimals } from '@/app/actions/client/peso';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
}: {
  orderType: string;
  onCheckout?: boolean;
  orderLines: OrderLineBase[];
  totalAmount: number;
  order: OrderBase;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { storeName } = useStore();
  //const { orderLines } = useCartStore();

  // Sort by productName (case-insensitive)
  const sortedData = orderLines.sort((a, b) =>
    a.productName.localeCompare(b.productName),
  );

  const totalItems = orderLines.length || 0;

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

      let updatedData = order;
      updatedData.orderLines = updatedOrderLines;

      const updatedOrder = await UpdateOrder(updatedData);

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

      if (existingIndex !== -1) {
        const updatedOrderLines = [...orderLines];
        const existingOrder = updatedOrderLines[existingIndex];

        if (action === 'add') {
          updatedOrderLines[existingIndex] = {
            ...existingOrder,
            quantity: existingOrder.quantity + 1,
            amount: existingOrder.amount + line.unitPrice,
          };
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
        }

        let updatedData = { ...order, orderLines: updatedOrderLines };

        await UpdateOrder(updatedData);

        toast({
          title: 'Line updated',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{`Data : ${line.productName}, ${line.sizeOption}, ${line.spiceOption}`}</code>
            </pre>
          ),
        });

        await revalidateAndRedirectUrl(pathname);
      } else {
        console.log('Order line not found - cannot update');
      }
    } catch (error) {
      console.error('Error updating order line:', error);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [lineKey]: false })); // Stop loading (always runs)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Order Lines</CardTitle>

        <p className="p-2">
          {`Items (${totalItems}) : ${formatPesoNoDecimals(
            Math.floor(totalAmount),
          )}`}
          <span className="text-xs">
            .{totalAmount.toFixed(2).toString().split('.')[1]}
          </span>
        </p>
        {onCheckout && order.status === 'open' ? (
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
        )}
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
