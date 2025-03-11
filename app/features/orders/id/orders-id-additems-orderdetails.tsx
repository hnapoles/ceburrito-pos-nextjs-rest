import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { formatPesoNoDecimals } from '@/app/actions/client/peso';
//import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button-rounded-sm';

import { OrderBase, OrderLineBase } from '@/app/models/orders-model';
import { Minus, Plus, Loader2 } from 'lucide-react';
import { UpdateOrder } from '@/app/actions/server/orders-actions';
import { toast } from '@/hooks/use-toast';
//import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
//import { Separator } from '@/components/ui/separator';

export default function OrdersByIdOrderDetails({
  order,
  setOrder,
}: {
  order: OrderBase;
  setOrder: React.Dispatch<React.SetStateAction<OrderBase>>;
}) {
  const searchParams = useSearchParams();
  const query = new URLSearchParams(searchParams);
  const router = useRouter();
  //const pathname = usePathname();

  // Sort by productName (case-insensitive)
  const sortedData = order.orderLines?.sort((a, b) =>
    a.productName.localeCompare(b.productName),
  );

  //const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  const [loadingItems, setLoadingItems] = React.useState<
    Record<string, boolean>
  >({});

  const handleCancelLine = async (line: OrderLineBase) => {
    const lineKey = `${line.productId ?? 'na'}-${line.sizeOption ?? ''}-${
      line.spiceOption ?? ''
    }-${line.status ?? 'open'}`;

    setLoadingItems((prev) => ({ ...prev, [lineKey]: true })); // Start loading
    const existingIndex = order.orderLines?.findIndex(
      (orderLine) =>
        orderLine.productName === line.productName &&
        (orderLine.sizeOption ?? '') === (line.sizeOption ?? '') &&
        (orderLine.spiceOption ?? '') === (line.spiceOption ?? '') &&
        (orderLine.status ?? 'open') === (line.status ?? 'open'),
    );

    if (existingIndex !== -1) {
      const updatedOrderLines = [...(order.orderLines ?? [])];
      const existingOrder = updatedOrderLines[existingIndex || 0];

      updatedOrderLines[existingIndex || 0] = {
        ...existingOrder,
        status: 'canceled',
      };

      const updatedData = order;
      updatedData.totalAmount = (updatedData.totalAmount || 0) - line.amount;
      updatedData.orderLines = updatedOrderLines;

      await UpdateOrder(updatedData);

      toast({
        title: 'Line canceled',
        description: (
          <p>
            {`${line.productName}, ${line.sizeOption || ''}, ${
              line.spiceOption || ''
            }`}
          </p>
        ),
      });

      setOrder(updatedData);
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
      const existingIndex = order.orderLines?.findIndex(
        (orderLine) =>
          orderLine.productName === line.productName &&
          (orderLine.sizeOption ?? '') === (line.sizeOption ?? '') &&
          (orderLine.spiceOption ?? '') === (line.spiceOption ?? '') &&
          (orderLine.status ?? 'open') === (line.status ?? 'open'),
      );

      let totalAmount = order.totalAmount;
      if (existingIndex !== -1) {
        const updatedOrderLines = [...(order.orderLines ?? [])];
        const existingOrder = updatedOrderLines[existingIndex || 0];

        if (action === 'add') {
          updatedOrderLines[existingIndex || 0] = {
            ...existingOrder,
            quantity: existingOrder.quantity + 1,
            amount: existingOrder.amount + line.unitPrice,
          };
          totalAmount = (order.totalAmount || 0) + line.unitPrice;
        } else if (action === 'subtract') {
          if (line.quantity === 1) {
            updatedOrderLines[existingIndex || 0] = {
              ...existingOrder,
              status: 'canceled',
            };
          } else {
            updatedOrderLines[existingIndex || 0] = {
              ...existingOrder,
              quantity: existingOrder.quantity - 1,
              amount: existingOrder.amount - line.unitPrice,
            };
          }
          totalAmount = (order.totalAmount || 0) - line.unitPrice;
        }

        const updatedData = {
          ...order,
          totalAmount: totalAmount,
          orderLines: updatedOrderLines,
        };

        await UpdateOrder(updatedData);

        toast({
          title: 'Line item updated',
          description: (
            <p>{`${line.productName}, ${line.sizeOption || ''}, ${
              line.spiceOption || ''
            }`}</p>
          ),
        });

        setOrder(updatedData);
        //await revalidateAndRedirectUrl(pathname);
        //router.refresh(); // ✅ Forces a fresh fetch from the server
        query.set('refresh', Date.now().toString()); // Change URL to trigger a refresh
        router.push(`?${query.toString()}`);
      } else {
        console.log('Order line not found - cannot update');
      }
    } catch (error) {
      console.error('Error updating order line:', error);
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
          <div className="text-base font-semibold">Order cart</div>
        </div>

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
                      <div
                        className={cn(
                          'mt-0 flex',
                          order.status === 'open' && l.status !== 'canceled'
                            ? ''
                            : 'hidden',
                        )}
                      >
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
                        <p
                          className={cn(
                            'text-gray-500',
                            l.status === 'canceled' ? 'text-red-500' : 'hidden',
                          )}
                        >
                          Canceled qty {l.quantity}
                        </p>
                        <button
                          type="button"
                          className={cn(
                            'font-medium text-red-600 hover:text-indigo-500',
                            l.status === 'canceled' ? 'hidden' : '',
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
                            'Cancel'
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
      </div>
    </div>
  );
}
