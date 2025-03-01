import { ProductBase } from '@/app/models/products-model';
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

export default function OrdersCreateCartBase() {
  const { storeName } = useStore();
  const { orderLines } = useCartStore();

  const totalAmount = useCartStore((state) => state.totalAmount());
  const totalItems = useCartStore((state) => state.totalItems());

  async function handleChangeQty(action: string) {}

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Cart</CardTitle>
        {storeName}
        <p>
          {`Items (${totalItems}) : ${formatPesoNoDecimals(
            Math.floor(totalAmount),
          )}`}
          <span className="text-xs">
            .{totalAmount.toString().split('.')[1]}
          </span>
        </p>
        <Button className="w-full" disabled={orderLines.length === 0}>
          Checkout
        </Button>
      </CardHeader>
      <CardContent>
        {orderLines.map((l) => (
          <div key={l.productId + l.sizeOption}>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-left gap-1">
                <div>
                  <Image
                    src={
                      l.imageUrl || '/images/products/no-image-for-display.webp'
                    }
                    alt="image"
                    width={100}
                    height={100}
                    className="h-20 w-20 aspect-square object-cover transition-all hover:scale-105"
                  />
                </div>
                <div className="col-span-3 ml-0">
                  <div>
                    <strong>{l.productName}</strong>
                  </div>
                  Amount : {formatPeso(l.amount)}{' '}
                  <Badge variant="outline">{l.sizeOption}</Badge>
                  <div className="text-xs">spice : {l.spiceOption}</div>
                  <div className="text-xs">
                    Unit Price: {formatPeso(l.unitPrice)}
                  </div>
                  <div className="mt-0 flex">
                    <Button
                      variant="outline"
                      onClick={() => handleChangeQty('subtract')}
                      className="rounded-none"
                    >
                      <strong>-</strong>
                    </Button>
                    <Button
                      variant="outline"
                      className={cn(
                        'rounded-none',
                        l.quantity > 0 ? 'border-purple-500' : '',
                      )}
                    >
                      {l.quantity}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleChangeQty('add')}
                      className="rounded-none"
                    >
                      <strong>+</strong>
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
