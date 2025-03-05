'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import OrdersCartBase from '../cart/orders-cart-base';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCartStore, useStore } from '@/app/providers/zustand-provider';
import ErrorDisplay from '../../error/error-display';
import { formatPeso } from '@/app/actions/client/peso';
import { Lookup } from '@/app/models/lookups-model';
import React from 'react';
import { Button } from '@/components/ui/button-rounded-sm';

import KeyboardTouchLettersDialog from '../../keyboard/keyboard-touch-letters-dialog';
import KeyboardTouchEmailDialog from '../../keyboard/keyboard-touch-email-dialog';
import { OrderBase } from '@/app/models/orders-model';
import { CreateOrder } from '@/app/actions/server/orders-actions';
import { toast } from '@/hooks/use-toast';
import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { cn } from '@/lib/utils';

export default function OrdersCheckoutBase({
  orderType,
  dineModes,
  paymentMethods,
}: {
  orderType: string;
  dineModes: Lookup[];
  paymentMethods: Lookup[];
}) {
  const { storeName } = useStore();
  const { orderLines } = useCartStore();
  const totalAmount = useCartStore((state) => state.totalAmount());
  const totalItems = useCartStore((state) => state.totalItems());
  const { clearCart } = useCartStore();

  const cartIsEmpty = !orderLines || orderLines.length === 0;

  const [dineMode, setDineMode] = React.useState(
    dineModes[0]?.lookupValue || '',
  );
  const selectedMode = dineModes.find((mode) => mode.lookupValue === dineMode);

  const [paymentMethod, setPaymentMethod] = React.useState('');
  /*
  const selectedMethod = paymentMethods.find(
    (method) => method.lookupValue === paymentMethod,
  );
  */

  const [customerName, setCustomerName] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');

  const [isNameTouchDialogOpen, setIsNameTouchDialogOpen] =
    React.useState(false);
  const [isEmailTouchDialogOpen, setIsEmailTouchDialogOpen] =
    React.useState(false);

  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSaveOrder = async () => {
    setIsProcessing(true);
    const newOrder: OrderBase = {
      orderedAt: new Date().toISOString(),
      type: orderType,
      mode: dineMode,
      paymentMethod: paymentMethod,
      status: 'open',
      storeName: storeName || '',
      customerName: customerName,
      customerEmail: customerEmail,
      totalAmount: totalAmount,
      orderLines: orderLines,
    };

    const createdOrder = await CreateOrder(newOrder);

    toast({
      title: 'Data saved',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{`Order Id : ${createdOrder._id}`}</code>
        </pre>
      ),
    });

    clearCart();
    setIsProcessing(true);
    await revalidateAndRedirectUrl('/orders');
  };

  return (
    <>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Side: Order Type, Item Count, Total Amount */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="w-32">Total Amount</Label>
                      <Input
                        type="text"
                        id="totalAmount"
                        defaultValue={formatPeso(totalAmount)}
                        readOnly
                        className="bg-gray-50 border-none w-full"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="w-32">Item Count</Label>
                      <Input
                        type="text"
                        id="itemCount"
                        defaultValue={totalItems}
                        readOnly
                        className="bg-gray-50 border-none w-full"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="w-32">Order Type</Label>
                      <Input
                        type="text"
                        id="orderType"
                        defaultValue={orderType.toUpperCase()}
                        readOnly
                        className="bg-gray-50 border-none w-full"
                      />
                    </div>
                  </div>

                  {/* Right Side: Payment Method, Dine Mode, Store Name */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="w-32">Payment Method</Label>
                      <Select
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Payment Method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Payment Options</SelectLabel>
                            {paymentMethods.map((method) => (
                              <SelectItem
                                key={method._id}
                                value={method.lookupValue}
                              >
                                {method.lookupDescription}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="w-32">Dine Mode</Label>
                      <Select value={dineMode} onValueChange={setDineMode}>
                        <SelectTrigger>
                          <SelectValue>
                            {selectedMode?.lookupDescription ||
                              'Select Dine Mode'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Dine Options</SelectLabel>
                            {dineModes.map((mode) => (
                              <SelectItem
                                key={mode._id}
                                value={mode.lookupValue}
                              >
                                {mode.lookupDescription}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="w-32">Store Name</Label>
                      <Input
                        type="text"
                        id="storeName"
                        defaultValue={storeName?.toUpperCase()}
                        readOnly
                        className="bg-gray-50 border-none w-full"
                      />
                    </div>
                  </div>

                  {/* Customer and Email Fields */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Label className="w-32">Customer</Label>
                      <Input
                        type="text"
                        id="customer"
                        defaultValue={customerName}
                        readOnly
                        className="w-full"
                        placeholder="Enter name"
                        onClick={() => setIsNameTouchDialogOpen(true)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="w-32">Email</Label>
                      <Input
                        type="email"
                        id="customerEmail"
                        defaultValue={customerEmail}
                        placeholder="Enter email"
                        readOnly
                        className="w-full"
                        onClick={() => setIsEmailTouchDialogOpen(true)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className={cn('w-full md:w-1/2', cartIsEmpty ? 'hidden' : '')}
                disabled={
                  !paymentMethod || !dineMode || !customerName || isProcessing
                }
                onClick={handleSaveOrder}
              >
                {isProcessing ? 'Processing...' : 'Save Order'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* Right Side - cart */}
        <div className="col-span-1 h-full">
          <OrdersCartBase orderType={'pos'} onCheckout={true} />
        </div>
      </div>
      <>
        <KeyboardTouchLettersDialog
          currentValue={customerName}
          setTouchValue={setCustomerName}
          setIsTouchDialogOpen={setIsNameTouchDialogOpen}
          isTouchDialogOpen={isNameTouchDialogOpen}
        />
        <KeyboardTouchEmailDialog
          currentValue={customerEmail}
          setTouchValue={setCustomerEmail}
          setIsTouchDialogOpen={setIsEmailTouchDialogOpen}
          isTouchDialogOpen={isEmailTouchDialogOpen}
        />
      </>
    </>
  );
}
