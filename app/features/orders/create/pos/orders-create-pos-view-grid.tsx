'use client';
import React from 'react';

import { useCartStore } from '@/app/providers/zustand-provider';
//import { useRouter } from 'next/navigation';

import {
  ProductBase,
  ProductSellingPriceBase,
} from '@/app/models/products-model';
import { Lookup } from '@/app/models/lookups-model';

import {
  Card,
  CardContent,
  //CardFooter,
  //CardDescription,
  CardHeader,
  //CardTitle,
} from '@/components/ui/card';
import { formatPeso } from '@/app/actions/client/peso';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { GetProductSellingPriceByOrderType } from '@/app/actions/server/product-selling-prices-actions';
import { Minus, Plus } from 'lucide-react';

interface productGridViewProps {
  products: ProductBase[];
  storeName?: string | null;
  totalDataCount?: number | 1;
  statusesLookup?: Lookup[];
}

const OrdersCreatePosViewGrid: React.FC<productGridViewProps> = ({
  products,
  storeName,
}) => {
  if (!products) {
    return <div className="ml-4 text-red-500">No products found !</div>;
  }

  //const router = useRouter();
  const [selectedProduct, setSelectedProduct] =
    React.useState<ProductBase | null>(null);
  const [qty, setQty] = React.useState<number>(1);
  const [amount, setAmount] = React.useState<number>(0);
  const [size, setSize] = React.useState<string>('');
  const [spice, setSpice] = React.useState<string>('');

  const [sortedSizeOptions, setSortedSizeOptions] = React.useState<
    string[] | undefined | null
  >([]);

  const [sortedSpiceOptions, setSortedSpiceOptions] = React.useState<
    string[] | undefined | null
  >([]);

  const [prices, setPrices] = React.useState<
    ProductSellingPriceBase[] | undefined | null
  >([]);
  const [currentPrice, setCurrentPrice] = React.useState<number>(0);

  async function handleSelectProduct(p: ProductBase) {
    //get product price based on selected product

    if (p.isOutOfStock) return;

    const price = await GetProductSellingPriceByOrderType(
      p?._id || '',
      'pos',
      'Mandaue Main',
    );
    setPrices(price.data);

    setSelectedProduct(p);

    // Define the custom order
    const sizeOrder = ['S', 'M', 'L', 'XL'];
    const spiceOrder = ['Mild', 'Regular', 'Spicy', 'Extra Spicy'];

    // Sort sizeOptions based on the custom order
    const newSizeOptions = p.sizeOptions?.sort((a, b) => {
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });
    setSortedSizeOptions(newSizeOptions || []);

    const newSpiceOptions = p.spiceOptions?.sort((a, b) => {
      return spiceOrder.indexOf(a) - spiceOrder.indexOf(b);
    });
    setSortedSpiceOptions(newSpiceOptions || []);
  }

  async function handleSelectSize(size: string) {
    // Function to find the matching size
    const findSizeMatch = (size: string) => {
      return prices?.find((item) => item.size === size);
    };
    const result = findSizeMatch(size);
    if (result && result?.sellingPrice) {
      setCurrentPrice(result?.sellingPrice || 0);
      setAmount(result?.sellingPrice || 0);
    } else {
      setCurrentPrice(selectedProduct?.basePrice || 0);
      setAmount(selectedProduct?.basePrice || 0);
    }
    setSize(size);
    //reset qty to 1
    setQty(1);
  }

  async function handleChangeQty(action: string) {
    setQty((prev) => {
      let newQty = prev;

      // Update the qty based on the action
      if (action === 'add' && newQty < 99) {
        newQty += 1;
      } else if (action === 'subtract' && newQty > 1) {
        newQty -= 1;
      }
      if (action === 'refresh') {
        newQty = prev;
      }

      const price = currentPrice;

      // Update amount based on new qty value
      setAmount((prevAmount) => {
        // Assuming amount is calculated as qty * price (for example)
        return price * newQty; // Adjust this calculation based on your use case
      });

      return newQty; // Return the updated qty
    });
  }

  const addOrUpdateOrderLine = useCartStore(
    (state) => state.addOrUpdateOrderLine,
  );

  async function handleAddToOrder() {
    if (selectedProduct) {
      addOrUpdateOrderLine({
        productId: selectedProduct._id || '',
        productName: selectedProduct.name,
        imageUrl: selectedProduct.imageUrl,
        sizeOption: size,
        spiceOption: spice,
        quantity: qty,
        unitPrice: currentPrice,
        amount: amount,
      });

      toast({
        title: 'Update success',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <p className="text-white">{selectedProduct.name}, added to cart </p>
          </pre>
        ),
      });
      setSelectedProduct(null);
      setQty(0);
      setAmount(0);
      setSize('');
      setSpice('');
      revalidateAndRedirectUrl('/orders/create/pos');
    }
  }

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (storeName) {
      setIsLoading(false);
    }
  }, [storeName]);

  if (isLoading) {
    return (
      <div className="text-center text-gray-500">Loading store data...</div>
    );
  }

  return (
    <div className="container mx-auto lg:p-1 md:p-1 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1">
        {products.map((product) => (
          <Card
            key={product._id}
            className={cn(
              'flex flex-col items-center',
              product.isOutOfStock ? '' : 'hover:pointer-cursor',
            )}
            onClick={() => handleSelectProduct(product)}
          >
            <CardHeader className="w-full flex justify-center pb-2 relative">
              <Image
                src={
                  product.imageUrl ||
                  '/images/products/no-image-for-display.webp'
                }
                alt="image"
                width={200} // Ensures correct size for Next.js optimization
                height={200} // Keeps a consistent aspect ratio
                className={cn(
                  'w-full h-auto aspect-square object-cover transition-all hover:scale-105',
                  product.isOutOfStock ? 'grayscale opacity-50' : '', // Apply grayscale when out of stock
                )}
              />
              {/* Cross-out overlay */}
              {product.isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-full h-0.5 bg-red-600 rotate-45"></div>
                  <div className="absolute w-full h-0.5 bg-red-600 -rotate-45"></div>
                </div>
              )}
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
            setQty(0);
            setAmount(0);
            setSize('');
            setSpice('');
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
                    selectedProduct?.imageUrl ||
                    '/images/products/no-image-for-display.webp'
                  }
                  alt="image"
                  width={200}
                  height={200}
                  className="h-35 w-50 aspect-square object-cover transition-all hover:scale-105"
                />
              </div>
              <div className="col-span-3 ml-4">
                <strong>{selectedProduct?.name}</strong>
                <p>{selectedProduct?.description}</p>
                {formatPeso(selectedProduct?.basePrice)}{' '}
                <Badge variant="outline">base</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <div className="mb-0">
              <Label className="mb-0">Size:</Label>
            </div>
            <div className="grid grid-cols-4 items-left gap-2">
              {sortedSizeOptions?.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={() => {
                    handleSelectSize(s);
                  }}
                  className={s === size ? 'border-purple-500' : ''}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1">
            <div className="mb-0">
              <Label className="mb-0" hidden={sortedSpiceOptions?.length === 0}>
                Spice:
              </Label>
            </div>
            <div className="grid grid-cols-4 items-left gap-2">
              {sortedSpiceOptions?.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    setSpice(s);
                  }}
                  className={s === spice ? 'border-purple-500' : ''}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1">
            <div className="mb-0">
              <Label className="mb-0">Quantity:</Label>
            </div>
            <div className="mt-0 flex">
              <Button
                variant="outline"
                onClick={() => handleChangeQty('subtract')}
                className="rounded-none"
                size="icon"
              >
                <Minus />
              </Button>
              <Button
                variant="outline"
                className={cn(
                  'rounded-none',
                  qty > 0 ? 'border-purple-500' : '',
                )}
                size="icon"
              >
                {qty}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleChangeQty('add')}
                className="rounded-none"
                size="icon"
              >
                <Plus />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <div className="mb-0">
              <Label className="mb-0">Amount:</Label>
            </div>
            <div className="mt-0 flex">
              <Button
                variant="outline"
                className={cn(
                  'rounded-none',
                  amount > 0 ? 'border-purple-500' : '',
                )}
              >
                {formatPeso(amount)}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="flex"
              disabled={amount <= 0}
              onClick={handleAddToOrder}
            >
              Add to Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersCreatePosViewGrid;
