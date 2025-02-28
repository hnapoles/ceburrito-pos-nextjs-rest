'use client';
import React from 'react';

import { useRouter } from 'next/navigation';

import { ProductBase } from '@/app/models/products-model';
import { Lookup } from '@/app/models/lookups-model';

import {
  Card,
  CardContent,
  CardFooter,
  //CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPeso } from '@/app/actions/client/peso';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UpdateProduct } from '@/app/actions/server/products-actions';
import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface productGridViewProps {
  products: ProductBase[];
  totalDataCount?: number | 1;
  statusesLookup?: Lookup[];
}

const OrdersCreatePosViewGrid: React.FC<productGridViewProps> = ({
  products,
}) => {
  if (!products) {
    return <div className="ml-4 text-red-500">No products found !</div>;
  }

  const [selectedProduct, setSelectedProduct] =
    React.useState<ProductBase | null>(null);

  const router = useRouter();

  async function markProductAsClosed() {
    if (selectedProduct) {
      let newData: ProductBase = {
        ...selectedProduct,
        status: 'closed',
      };
      const updatedData = await UpdateProduct(newData);

      toast({
        title: 'Update success',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(updatedData, null, 2)}
            </code>
          </pre>
        ),
      });
      setSelectedProduct(null);
      revalidateAndRedirectUrl('/products');
    }
  }

  return (
    <div className="container mx-auto lg:p-1 md:p-1 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1">
        {products.map((product) => (
          <Card
            key={product._id}
            className="flex flex-col items-center hover:pointer-cursor"
            onClick={() => setSelectedProduct(product)}
          >
            <CardHeader className="w-full flex justify-center pb-2">
              <Image
                src={product.imageUrl || '/images/products/no-image.jpg'}
                alt="image"
                width={200} // Ensures correct size for Next.js optimization
                height={200} // Keeps a consistent aspect ratio
                className="w-full h-auto aspect-square object-cover transition-all hover:scale-105"
              />
            </CardHeader>
            <CardContent className="text-center flex flex-col items-center">
              <div className="text-black-500 text-xs w-35 overflow-hidden text-ellipsis whitespace-nowrap">
                {product.name}
              </div>
              <Badge variant="outline">{product.category}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Size Selection Dialog -- outside the loop */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            // If "X" button is clicked or another valid close action, allow closing
            setSelectedProduct(null);
          }
        }}
      >
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()} // Prevents closing on outside click
        >
          <DialogHeader>
            <DialogTitle>Select Options</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-1">
            <div className="grid grid-cols-4 items-top gap-1">
              <div>
                <Image
                  src={
                    selectedProduct?.imageUrl || '/images/products/no-image.jpg'
                  }
                  alt="image"
                  width={200}
                  height={200}
                  className="h-35 w-50 aspect-square object-cover transition-all hover:scale-105"
                />
                <div className="mt-2 flex">
                  <Button variant="outline">-</Button>
                  <Button variant="outline">1</Button>
                  <Button variant="outline">+</Button>
                </div>
              </div>
              <div className="col-span-3 ml-4">
                <strong>{selectedProduct?.name}</strong>
                <p>{selectedProduct?.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-left gap-2">
            <Button variant="outline">S</Button>
            <Button variant="outline">M</Button>
            <Button variant="outline">L</Button>
            <Button variant="outline">XL</Button>
          </div>
          <div className="grid grid-cols-4 items-left gap-2">
            <Button variant="outline">Regular</Button>
            <Button variant="outline">Medium</Button>
            <Button variant="outline">Spicy</Button>
            <Button variant="outline">Xtra Spicy</Button>
          </div>
          <div>
            <Button variant="outline">-</Button>
            <Button variant="outline">1</Button>
            <Button variant="outline">+</Button>
          </div>
          <DialogFooter>
            <Button className="flex">Add to Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersCreatePosViewGrid;
