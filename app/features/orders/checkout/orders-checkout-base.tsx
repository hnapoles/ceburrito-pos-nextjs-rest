'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import OrdersCartBase from '../cart/orders-create-cart-base';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCartStore, useStore } from '@/app/providers/zustand-provider';
import ErrorDisplay from '../../error/error-display';
import { formatPeso } from '@/app/actions/client/peso';
import { Lookup } from '@/app/models/lookups-model';
import React from 'react';

export default function OrdersCheckoutBase({
  orderType,
  dineModes,
}: {
  orderType: string;
  dineModes: Lookup[];
}) {
  const { storeName } = useStore();
  const { orderLines } = useCartStore();
  const totalAmount = useCartStore((state) => state.totalAmount());
  const totalItems = useCartStore((state) => state.totalItems());

  const cartIsEmpty = !orderLines || orderLines.length === 0;

  const [dineMode, setDineMode] = React.useState(
    dineModes[0]?.lookupValue || '',
  ); // Default to first lookupValue
  // ✅ Fix: Ensure `lookupDescription` is displayed for the selected `lookupValue`
  // ✅ Fix: Ensure `lookupDescription` is displayed correctly
  const selectedMode = dineModes.find((mode) => mode.lookupValue === dineMode);

  console.log('selected mode ', selectedMode);

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
              <div className="flex flex-col gap-3 md:w-1/4 w-full">
                <Label>Order Type</Label>
                <Input
                  type="text"
                  id="orderType"
                  defaultValue={orderType.toUpperCase()}
                  readOnly
                  className="bg-gray-50 border-none"
                />
                <Label>Item Count</Label>
                <Input
                  type="text"
                  id="orderType"
                  defaultValue={totalItems}
                  readOnly
                  className="bg-gray-50 border-none"
                />
                <Label>Total Amount</Label>
                <Input
                  type="text"
                  id="orderType"
                  defaultValue={formatPeso(totalAmount)}
                  readOnly
                  className="bg-gray-50 border-none"
                />
                <Label htmlFor="dineMode">Dine Mode</Label>

                {/* Select for predefined options */}
                <Select value={dineMode} onValueChange={setDineMode}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedMode?.lookupDescription || 'Select Dine Mode'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Options</SelectLabel>
                      {dineModes.map((mode) => (
                        <SelectItem key={mode._id} value={mode.lookupValue}>
                          {mode.lookupDescription}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Label>Customer</Label>
                <Input
                  type="text"
                  id="customer"
                  defaultValue={''}
                  readOnly
                  className="bg-gray-50 border-none"
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
