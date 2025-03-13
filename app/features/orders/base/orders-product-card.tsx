'use client';
import React from 'react';

//import { useCartStore } from '@/app/providers/zustand-provider';
//import { useRouter } from 'next/navigation';

import {
  ProductBase,
  ProductSellingPriceBase,
} from '@/app/models/products-model';
import { Lookup } from '@/app/models/lookups-model';

import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import { Button } from '@/components/ui/button-rounded-sm';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
//import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { GetProductSellingPriceByOrderType } from '@/app/actions/server/product-selling-prices-actions';
import { Minus, Plus } from 'lucide-react';
import { OrderBase, OrderLineBase } from '@/app/models/orders-model';

interface productGridViewProps {
  products: ProductBase[];
  storeName?: string | null;
  totalDataCount?: number | 1;
  statusesLookup?: Lookup[];
  order?: OrderBase;
  itemsCount: number | 0;
  totalAmount: number | 0;
  //setOrder: React.Dispatch<React.SetStateAction<OrderBase>>;
  onSubmit: (data: OrderLineBase) => void;
}

const OrdersProductCard: React.FC<productGridViewProps> = ({
  products,
  storeName,
  order,
  itemsCount,
  totalAmount,
  //setOrder,
  onSubmit,
}) => {
  //const router = useRouter();
  const [selectedProduct, setSelectedProduct] =
    React.useState<ProductBase | null>(null);
  const [qty, setQty] = React.useState<number>(0);
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
    // This is not used for now
    const sizeOrder = ['S', 'M', 'L', 'XL'];
    const spiceOrder = ['Mild', 'Regular', 'Spicy', 'Extra Spicy'];

    // Sort sizeOptions based on the custom order
    // not used for now
    const newSizeOptions = p.sizeOptions?.sort((a, b) => {
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });
    setSortedSizeOptions(newSizeOptions || []);

    const newSpiceOptions = p.spiceOptions?.sort((a, b) => {
      return spiceOrder.indexOf(a) - spiceOrder.indexOf(b);
    });
    setSortedSpiceOptions(newSpiceOptions || []);

    setCurrentPrice(prices?.[0]?.sellingPrice ?? p.basePrice ?? 0);
    setAmount((currentPrice ?? 0) * 1);
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
      setAmount(() => {
        // Assuming amount is calculated as qty * price (for example)
        return price * newQty; // Adjust this calculation based on your use case
      });

      return newQty; // Return the updated qty
    });
  }

  async function handleAddToOrder() {
    if (selectedProduct) {
      const newOrderLine: OrderLineBase = {
        productId: selectedProduct._id || '',
        productName: selectedProduct.name,
        imageUrl: selectedProduct.imageUrl,
        sizeOption: size,
        spiceOption: spice,
        quantity: qty,
        unitPrice: currentPrice,
        amount: amount,
        status: 'open',
      };

      //do callBack here instead
      onSubmit(newOrderLine);

      setSelectedProduct(null);
      setQty(0);
      setAmount(0);
      setSize('');
      setSpice('');
      setPrices([]);
      setCurrentPrice(0);
      ///revalidateAndRedirectUrl(`/orders/${order._id}/addItems`);
      //setOrder(updatedData);
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

  if (!products) {
    return <div className="ml-4 text-red-500">No products found !</div>;
  }

  return (
    <div>
      <div className="mt-4 grid grid-cols-1 gap-x-2 gap-y-4 md:gap-y-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="group relative"
            onClick={() => handleSelectProduct(product)}
          >
            <Image
              alt="image"
              src={
                product.imageUrl || '/images/products/no-image-for-display.webp'
              }
              width={200}
              height={200}
              className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-auto"
            />
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">
                  <div
                    className={cn(
                      'flex flex-col items-center border-none',
                      product.isOutOfStock ? '' : 'hover:pointer-cursor',
                    )}
                  >
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </div>
                </h3>
                {/*<p className="mt-1 text-sm text-gray-500">
                  {product.isOutOfStock ? 'out of stock' : product.category}
                </p>*/}
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatPesoNoDecimals(product.basePrice)}
              </p>
            </div>
          </div>
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
            setPrices([]);
            setCurrentPrice(0);
          }
        }}
      >
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()} // Prevents closing on outside click
        >
          <DialogHeader>
            <DialogTitle>Select Options</DialogTitle>
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-2">
                <span className="font-medium whitespace-nowrap">
                  Cart Items (
                  <span className="text-purple-700 whitespace-nowrap">
                    {itemsCount}
                  </span>
                  ):
                </span>
                <span className="text-purple-700 whitespace-nowrap">
                  {formatPesoNoDecimals(Math.floor(totalAmount || 0))}
                </span>
              </div>

              <div className="flex items-center space-x-2 ml-4 hidden">
                <span className="font-medium whitespace-nowrap">
                  Order Type:
                </span>
                <span className="text-purple-700 whitespace-nowrap">
                  {order?.type?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <span className="font-medium whitespace-nowrap">Store:</span>
                <span className="text-purple-700 whitespace-nowrap">
                  {storeName?.toUpperCase()}
                </span>
              </div>
            </div>
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
                {formatPesoNoDecimals(selectedProduct?.basePrice || 0)}{' '}
                <Badge variant="outline">base</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <div
              className={cn(
                'mb-0',
                (selectedProduct?.sizeOptions?.length || 0) > 0 ? '' : 'hidden',
              )}
            >
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
              <Label className="mb-0">Unit Price:</Label>
            </div>
            <div className="flex gap-2">
              <span hidden={(selectedProduct?.sizeOptions?.length || 0) > 0}>
                {formatPesoNoDecimals(selectedProduct?.basePrice || 0)}{' '}
                <Badge variant="outline">base</Badge>
              </span>
              {selectedProduct?.sizeOptions && (
                <div className="flex gap-2">
                  {prices?.map((p) => (
                    <div key={p._id}>
                      {' '}
                      {formatPesoNoDecimals(p.sellingPrice)}{' '}
                      <Badge variant="outline">{p.size}</Badge>
                    </div>
                  ))}
                </div>
              )}
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
                {formatPesoNoDecimals(amount)}
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

export default OrdersProductCard;
