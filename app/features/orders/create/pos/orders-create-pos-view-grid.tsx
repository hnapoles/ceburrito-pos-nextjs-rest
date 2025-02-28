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
    <div className="container mx-auto lg:p-4 md:p-2 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-1">
        {products.map((product) => (
          <Link href={`/products/${product._id}`} key={product._id}>
            <Card className="flex flex-col items-center">
              <CardHeader className="w-full flex justify-center pb-2">
                <Image
                  src={product.imageUrl || '/images/products/no-image.jpg'}
                  alt="image"
                  width={200} // Increase width for a better view
                  height={200} // Maintain aspect ratio
                  className={cn(
                    'w-full h-48 object-cover transition-all hover:scale-105', // Ensures full width & centered
                  )}
                />
              </CardHeader>
              <CardContent className="text-center flex flex-col items-center">
                <div className="text-lg font-semibold">{product.name}</div>
                <div className="text-gray-500">
                  {formatPeso(product.basePrice || 0.0)}
                </div>
                <Badge variant="secondary">{product.category}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Dialog outside the loop */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedProduct(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Size Option</DialogTitle>
            <DialogDescription>
              Are you sure you want to close product{' '}
              <strong>{selectedProduct?._id?.slice(-4).toUpperCase()}</strong>{' '}
              for <strong>{selectedProduct?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
              Cancel
            </Button>
            <Button onClick={() => markProductAsClosed()}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersCreatePosViewGrid;
