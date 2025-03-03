import { useRouter } from 'next/navigation';

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
import { Separator } from '@/components/ui/separator';
import React, { useEffect } from 'react';
import { OrderLineBase } from '@/app/models/orders-model';
import { Minus, Plus, Trash } from 'lucide-react';

export default function OrdersIdLines({
  orderType,
  onCheckout = false,
  orderLines,
  totalAmount,
}: {
  orderType: string;
  onCheckout?: boolean;
  orderLines: OrderLineBase[];
  totalAmount: number;
}) {
  const router = useRouter();
  const { storeName } = useStore();
  //const { orderLines } = useCartStore();

  // Sort by productName (case-insensitive)
  const sortedData = orderLines.sort((a, b) =>
    a.productName.localeCompare(b.productName),
  );

  const totalItems = orderLines.length || 0;

  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const addOrUpdateOrderLine = useCartStore(
    (state) => state.addOrUpdateOrderLine,
  );
  const removeOrderLine = useCartStore((state) => state.removeOrderLine);

  const [isUpdating, setIsUpdating] = React.useState(false);

  async function handleChangeQty(currentData: OrderLineBase, action: string) {
    if (isUpdating) return; // Avoid multiple updates at the same time
    setIsUpdating(true); // Disable further clicks until the update is complete
    if (action === 'add') {
      const newQuantity = 1;
      const newAmount = currentData.unitPrice * newQuantity;

      const newData = {
        ...currentData,
        quantity: newQuantity,
        amount: newAmount,
      };
      addOrUpdateOrderLine(newData);
    }

    if (action === 'subtract') {
      if (currentData.quantity === 1) {
        removeOrderLine(
          currentData.productName,
          currentData.sizeOption,
          currentData.spiceOption,
        );
      }

      if (currentData.quantity > 1) {
        const newQuantity = -1;
        const newAmount = currentData.unitPrice * newQuantity;

        if (
          newQuantity !== currentData.quantity ||
          newAmount !== currentData.amount
        ) {
          const newData = {
            ...currentData,
            quantity: newQuantity,
            amount: newAmount,
          };
          addOrUpdateOrderLine(newData);
        }
      }
    }

    setIsUpdating(false); // Re-enable buttons after update is complete
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          Order Lines : {storeName} - {orderType.toUpperCase()}
        </CardTitle>

        <p>
          {`Items (${totalItems}) : ${formatPesoNoDecimals(
            Math.floor(totalAmount),
          )}`}
          <span className="text-xs">
            .{totalAmount.toFixed(2).toString().split('.')[1]}
          </span>
        </p>
        {onCheckout ? (
          <Button
            className="w-full"
            onClick={() => {
              router.push(`/orders/create/${orderType}`);
            }}
          >
            Add More Items
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={orderLines.length === 0}
            onClick={() => {
              router.push(`/orders/checkout/${orderType}`);
            }}
          >
            Checkout
          </Button>
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
                  <Image
                    src={
                      l.imageUrl || '/images/products/no-image-for-display.webp'
                    }
                    alt="image"
                    width={100}
                    height={100}
                    className="h-auto w-auto aspect-square object-cover transition-all hover:scale-105 h-full flex flex-col"
                  />
                  {/* Delete Button (Shown on Hover) */}
                  {hoveredItem === l.productId && (
                    <Button
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                      size="icon"
                      onClick={() =>
                        removeOrderLine(
                          l.productName,
                          l.sizeOption,
                          l.spiceOption,
                        )
                      }
                    >
                      <Trash size={16} />
                    </Button>
                  )}
                </div>
                <div className="col-span-3 ml-0">
                  <div>
                    <strong>{l.productName}</strong>
                  </div>
                  {formatPesoNoDecimals(Math.floor(l.amount))}
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
                    Unit Price: {formatPeso(l.unitPrice)}
                  </div>
                  <div className="mt-0 flex">
                    <Button
                      variant="outline"
                      onClick={() => handleChangeQty(l, 'subtract')}
                      className="rounded-none"
                      size="icon"
                    >
                      <Minus />
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
                    >
                      <Plus />
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
