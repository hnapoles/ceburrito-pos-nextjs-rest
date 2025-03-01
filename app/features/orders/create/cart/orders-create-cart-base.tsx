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
import { formatPeso } from '@/app/actions/client/peso';
import { Badge } from '@/components/ui/badge';

export default function OrdersCreateCartBase() {
  const { storeName } = useStore();
  const { orderLines } = useCartStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart</CardTitle>
        Store: {storeName}
      </CardHeader>
      <CardContent>
        {orderLines.map((l) => (
          <div key={l.productId + l.sizeOption}>
            <div className="grid gap-1">
              <div className="grid grid-cols-2 items-top gap-1">
                <div>
                  <Image
                    src={
                      l.imageUrl || '/images/products/no-image-for-display.webp'
                    }
                    alt="image"
                    width={200}
                    height={200}
                    className="h-12 w-12 aspect-square object-cover transition-all hover:scale-105"
                  />
                </div>
                <div className="col-span-2 ml-4">
                  <strong>{l.productName}</strong>
                  {formatPeso(l.amount)} <Badge variant="outline">paid</Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
