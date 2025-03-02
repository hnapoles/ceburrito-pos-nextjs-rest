'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import OrdersCartBase from '../cart/orders-create-cart-base';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCartStore, useStore } from '@/app/providers/zustand-provider';
import ErrorDisplay from '../../error/error-display';
import { formatPeso } from '@/app/actions/client/peso';

export default function OrdersCheckoutBase({
  orderType,
}: {
  orderType: string;
}) {
  const { storeName } = useStore();
  const { orderLines } = useCartStore();
  const totalAmount = useCartStore((state) => state.totalAmount());
  const totalItems = useCartStore((state) => state.totalItems());

  const cartIsEmpty = !orderLines || orderLines.length === 0;

  return (
    <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-4 md:grid-cols-4 grid-auto-rows-fr">
      {/* Left Side - add items */}
      <div className="md:col-span-2 col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            {cartIsEmpty ? (
              <ErrorDisplay message={'Empty Cart'} className={'bg-white'} />
            ) : (
              <div className="gap-2">
                <Label>Order Type</Label>
                <Input
                  type="text"
                  id="orderType"
                  defaultValue={orderType.toUpperCase()}
                  readOnly
                  className="w-1/2 bg-gray-50 border-none"
                />
                <Label>Total Amount</Label>
                <Input
                  type="text"
                  id="orderType"
                  defaultValue={formatPeso(totalAmount)}
                  readOnly
                  className="w-1/2 bg-gray-50 border-none"
                />
              </div>
            )}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
      {/* Right Side - cart */}
      <div className="col-span-1 h-full">
        <OrdersCartBase orderType={'pos'} onCheckout={true} />
      </div>
    </div>
  );
}
