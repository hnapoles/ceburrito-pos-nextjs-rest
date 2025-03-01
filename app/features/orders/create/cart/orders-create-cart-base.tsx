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
            <Image
              src={l.imageUrl || '/images/products/no-image-for-display.webp'}
              alt="image"
              width={200} // Ensures correct size for Next.js optimization
              height={200} // Keeps a consistent aspect ratio
              className={cn(
                'w-full h-auto aspect-square object-cover transition-all hover:scale-105',
                '',
              )}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
