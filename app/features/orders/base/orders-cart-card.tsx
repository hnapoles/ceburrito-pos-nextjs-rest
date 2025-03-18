import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { formatPesoNoDecimals } from '@/app/actions/client/peso';
//import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button-rounded-sm';

import { OrderLineBase } from '@/app/models/orders-model';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import { useCartStore, useStoreName } from '@/app/providers/zustand-provider';
//import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
//import { Separator } from '@/components/ui/separator';

export default function OrdersCartDetails({
  orderType,
}: {
  orderType: string;
  onCheckout?: boolean;
}) {
  const searchParams = useSearchParams();
  const query = new URLSearchParams(searchParams);
  const router = useRouter();
  //const pathname = usePathname();

  const { storeName } = useStoreName();
  const { orderLines } = useCartStore();

  // Sort by productName (case-insensitive)
  const sortedData = orderLines.sort((a, b) =>
    a.productName.localeCompare(b.productName),
  );

  const totalAmount = useCartStore((state) => state.totalAmount());
  const totalItems = useCartStore((state) => state.totalItems());

  const addOrUpdateOrderLine = useCartStore(
    (state) => state.addOrUpdateOrderLine,
  );
  const removeOrderLine = useCartStore((state) => state.removeOrderLine);

  //const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const [loadingItems, setLoadingItems] = React.useState<
    Record<string, boolean>
  >({});

  const handleCancelLine = async (line: OrderLineBase) => {
    const lineKey = `${line.productId ?? 'na'}-${line.sizeOption ?? ''}-${
      line.spiceOption ?? ''
    }-${line.status ?? 'open'}`;

    setLoadingItems((prev) => ({ ...prev, [lineKey]: true })); // Start loading
    const existingIndex = orderLines?.findIndex(
      (orderLine) =>
        orderLine.productName === line.productName &&
        (orderLine.sizeOption ?? '') === (line.sizeOption ?? '') &&
        (orderLine.spiceOption ?? '') === (line.spiceOption ?? '') &&
        (orderLine.status ?? 'open') === (line.status ?? 'open'),
    );

    if (existingIndex !== -1) {
      removeOrderLine(line.productName, line.sizeOption, line.spiceOption);

      toast({
        title: 'Line removed',
        description: <p>{line.productName}</p>,
      });

      query.set('refresh', Date.now().toString()); // Change URL to trigger a refresh
      router.push(`?${query.toString()}`);

      //await revalidateAndRedirectUrl(`/orders/${order._id}`);
    } else {
      console.log('not found - can not cancel');
    }
    setLoadingItems((prev) => ({ ...prev, [lineKey]: false })); // Stop loading
  };

  async function handleChangeQty(line: OrderLineBase, action: string) {
    const lineKey = `${line.productId ?? 'na'}-${line.sizeOption ?? ''}-${
      line.spiceOption ?? ''
    }-${line.status ?? 'open'}`;
    setLoadingItems((prev) => ({ ...prev, [lineKey]: true })); // Start loading

    try {
      if (action === 'add') {
        const newQuantity = 1;
        const newAmount = line.unitPrice * newQuantity;

        const newData = {
          ...line,
          quantity: newQuantity,
          amount: newAmount,
        };
        addOrUpdateOrderLine(newData);
      }

      if (action === 'subtract') {
        if (line.quantity === 1) {
          removeOrderLine(line.productName, line.sizeOption, line.spiceOption);
        }

        if (line.quantity > 1) {
          const newQuantity = -1;
          const newAmount = line.unitPrice * newQuantity;

          if (newQuantity !== line.quantity || newAmount !== line.amount) {
            const newData = {
              ...line,
              quantity: newQuantity,
              amount: newAmount,
            };
            addOrUpdateOrderLine(newData);
          }
        }
      }

      toast({
        title: 'Cart item updated',
        description: <p>{line.productName}</p>,
      });

      //await revalidateAndRedirectUrl(pathname);
      //router.refresh(); // ✅ Forces a fresh fetch from the server
      query.set('refresh', Date.now().toString()); // Change URL to trigger a refresh
      router.push(`?${query.toString()}`);
    } catch (error) {
      console.error('Error updating cart line:', error);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [lineKey]: false })); // Stop loading (always runs)
    }
  }

  /*
  const itemsCount = (order.orderLines || [])
    .filter((line) => (line.status ?? 'open') !== 'canceled') // Default status to "open"
    .reduce((sum, line) => sum + line.quantity, 0);

  const orderIdWithDashes = `${(order._id || '').slice(0, 4)}-${(
    order._id || ''
  ).slice(4, -4)}-${(order._id || '').slice(-4)}`;
  */

  return (
    <div className="flex h-full flex-col  bg-white shadow-xl border rounded-sm pb-20">
      <div className="flex-1  px-2 py-2 sm:px-6">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold">Cart</div>
          <div className="hidden">
            <span>Order Type {orderType}</span>
            <span>Store Name {storeName}</span>
            <span>Total Amount {totalAmount}</span>
            <span>Item Count {totalItems}</span>
          </div>
        </div>
        {!sortedData ||
          (sortedData.length === 0 && (
            <div className="text-red-500 text-sm mt-6">
              Empty Cart. Please add items.
            </div>
          ))}

        <div className="mt-6">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {sortedData?.map((l) => (
                <li
                  key={l.productId + l.sizeOption + l.spiceOption + l.status}
                  className="flex py-2"
                >
                  <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={
                        l.imageUrl ||
                        '/images/products/no-image-for-display.webp'
                      }
                      alt="image"
                      width={64}
                      height={64}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-gray-900">
                        <h3>
                          <a href="#">{l.productName}</a>
                        </h3>
                        <p className="ml-4">
                          {formatPesoNoDecimals(
                            Math.floor(
                              l.status !== 'canceled' ? l.amount || 0 : 0,
                            ),
                          )}
                        </p>
                      </div>
                      <p className="mt-0 text-xs text-gray-500">
                        <span className="text-gray-900">{l.sizeOption}</span>

                        <span className="ml-3 text-gray-900">
                          {l.spiceOption}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Unit Price{' '}
                        {formatPesoNoDecimals(Math.floor(l.unitPrice || 0))}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className={cn('mt-0 flex')}>
                        <Button
                          variant="ghost"
                          onClick={() => handleChangeQty(l, 'subtract')}
                          className="rounded-none bg-gray-100"
                          size="icon"
                          disabled={
                            loadingItems[
                              `${l.productId ?? 'na'}-${l.sizeOption ?? ''}-${
                                l.spiceOption ?? ''
                              }-${l.status ?? 'open'}`
                            ]
                          } // Disable button when loading
                        >
                          {loadingItems[
                            `${l.productId ?? 'na'}-${l.sizeOption ?? ''}-${
                              l.spiceOption ?? ''
                            }-${l.status ?? 'open'}`
                          ] ? (
                            <Loader2 className="animate-spin" size={8} />
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
                          variant="ghost"
                          onClick={() => handleChangeQty(l, 'add')}
                          className="rounded-none bg-gray-100"
                          size="icon"
                          disabled={
                            loadingItems[
                              `${l.productId ?? 'na'}-${l.sizeOption ?? ''}-${
                                l.spiceOption ?? ''
                              }-${l.status ?? 'open'}`
                            ]
                          } // Disable button when loading
                        >
                          {loadingItems[
                            `${l.productId ?? 'na'}-${l.sizeOption ?? ''}-${
                              l.spiceOption ?? ''
                            }-${l.status ?? 'open'}`
                          ] ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Plus />
                          )}
                        </Button>
                      </div>
                      <div className="flex text-xs">
                        <button
                          type="button"
                          className={cn(
                            'font-medium text-red-600 hover:text-indigo-500',
                          )}
                          onClick={() => handleCancelLine(l)}
                          disabled={
                            loadingItems[
                              `${l.productId ?? 'na'}-${l.sizeOption ?? ''}-${
                                l.spiceOption ?? ''
                              }-${l.status ?? 'open'}`
                            ]
                          }
                        >
                          {' '}
                          {loadingItems[
                            `${l.productId}-${l.sizeOption}-${l.spiceOption}`
                          ] ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            'Remove'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* */}
      </div>
    </div>
  );
}
