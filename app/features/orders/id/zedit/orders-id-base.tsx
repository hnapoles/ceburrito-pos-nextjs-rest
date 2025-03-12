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
import OrdersIdLines from './orders-id-lines';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatPeso } from '@/app/actions/client/peso';
import { Lookup } from '@/app/models/lookups-model';
import React from 'react';
import { Button } from '@/components/ui/button-rounded-sm';

import KeyboardTouchLettersDialog from '../../../keyboard/keyboard-touch-letters-dialog';
import KeyboardTouchEmailDialog from '../../../keyboard/keyboard-touch-email-dialog';
import { OrderBase } from '@/app/models/orders-model';
import { CreateOrder, UpdateOrder } from '@/app/actions/server/orders-actions';
import { toast } from '@/hooks/use-toast';
import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { cn } from '@/lib/utils';

export default function OrdersIdBase({
  dineModes,
  paymentMethods,
  statuses,
  orderData,
}: {
  dineModes: Lookup[];
  paymentMethods: Lookup[];
  statuses: Lookup[];
  orderData: OrderBase;
}) {
  const [order, setOrder] = React.useState(orderData);

  const orderIdWithDashes = `${(order._id || '').slice(0, 4)}-${(
    order._id || ''
  ).slice(4, -4)}-${(order._id || '').slice(-4)}`;
  const [dineMode, setDineMode] = React.useState(order.mode);
  const selectedMode = dineModes.find((mode) => mode.lookupValue === dineMode);

  const [paymentMethod, setPaymentMethod] = React.useState(order.paymentMethod);

  /*
  const selectedMethod = paymentMethods.find(
    (method) => method.lookupValue === paymentMethod,
  );
  */

  console.log('order data =', order);

  const [status, setStatus] = React.useState(order.status);
  const selectedStatus = statuses.find((s) => s.lookupValue === status);

  const [customerName, setCustomerName] = React.useState(
    order.customerName || '',
  );
  const [customerEmail, setCustomerEmail] = React.useState(
    order.customerEmail || '',
  );

  const [isNameTouchDialogOpen, setIsNameTouchDialogOpen] =
    React.useState(false);
  const [isEmailTouchDialogOpen, setIsEmailTouchDialogOpen] =
    React.useState(false);

  const [isProcessing, setIsProcessing] = React.useState(false);

  const lineItemCount = (order.orderLines || [])
    .filter((line) => (line.status ?? 'open') !== 'canceled') // Default status to "open"
    .reduce((sum, line) => sum + line.quantity, 0);

  const [itemsCount, setItemsCount] = React.useState(lineItemCount);

  // Sync state when `order` prop updates

  React.useEffect(() => {
    setOrder(order);
    setDineMode(order.mode);
    setPaymentMethod(order.paymentMethod);
    setStatus(order.status);
    setCustomerName(order.customerName || '');
    setCustomerEmail(order.customerEmail || '');
    setItemsCount(lineItemCount);
  }, [order, lineItemCount]); // Re-run effect when `order` changes

  const handleSaveOrder = async () => {
    setIsProcessing(true);
    const updatedData: OrderBase = {
      _id: order._id,
      paymentMethod: paymentMethod,
      mode: dineMode,
      status: status,
      customerName: customerName,
      customerEmail: customerEmail,
      totalAmount: order.totalAmount,
      type: order.type,
    };

    const updatedOrder = await UpdateOrder(updatedData);

    toast({
      title: 'Data saved',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{`Order Id : ${updatedOrder._id}`}</code>
        </pre>
      ),
    });

    setIsProcessing(false);
    await revalidateAndRedirectUrl('/orders');
  };

  const handleDuplicateOrder = async () => {
    setIsProcessing(true);
    const newData = order;
    delete newData._id;
    newData.customerName = customerName;
    newData.status = 'open';
    newData.customerEmail = customerEmail;
    newData.paymentMethod = paymentMethod;
    newData.mode = dineMode;

    const newOrder = await CreateOrder(newData);

    toast({
      title: 'Data saved',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{`Order Id : ${newOrder._id}`}</code>
        </pre>
      ),
    });

    setIsProcessing(false);
    await revalidateAndRedirectUrl('/orders');
  };

  return (
    <>
      <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-4 md:grid-cols-4 grid-auto-rows-fr">
        {/* Left Side - add items */}
        <div className="md:col-span-2 col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Side: Order Type, Item Count, Total Amount */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Id</Label>
                    <Input
                      type="text"
                      id="_id"
                      defaultValue={orderIdWithDashes}
                      readOnly
                      className="bg-transparent border-none w-full text-right focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Store Name</Label>
                    <Input
                      type="text"
                      id="storeName"
                      defaultValue={order.storeName}
                      readOnly
                      className="bg-transparent border-none w-full text-right focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Order Type</Label>
                    <Input
                      type="text"
                      id="orderType"
                      defaultValue={order.type?.toUpperCase()}
                      readOnly
                      className="bg-transparent border-none w-full text-right focus:ring-0 focus:outline-none"
                    />
                  </div>

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

                {/* Right Side: Payment Method, Dine Mode, Store Name */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Order Date</Label>
                    <Input
                      type="text"
                      id="itemCount"
                      defaultValue={
                        order.orderedAt
                          ? new Date(order.orderedAt).toLocaleString()
                          : ''
                      }
                      readOnly
                      className="bg-transparent border-none w-full text-right focus:ring-0 focus:outline-none"
                    />
                  </div>
                  new Item Count: {itemsCount}
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Items</Label>
                    <Input
                      type="text"
                      id="itemsCount"
                      defaultValue={itemsCount}
                      onChange={() => setItemsCount}
                      className="bg-transparent border-none w-full text-right focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Total Amount</Label>
                    <Input
                      type="text"
                      id="totalAmount"
                      defaultValue={formatPeso(order.totalAmount || 0)}
                      readOnly
                      className="bg-transparent border-none w-full text-right focus:ring-0 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      disabled={order.status !== 'open'}
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
                    <Select
                      value={dineMode}
                      onValueChange={setDineMode}
                      disabled={order.status !== 'open'}
                    >
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
                            <SelectItem key={mode._id} value={mode.lookupValue}>
                              {mode.lookupDescription}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Customer and Email Fields */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Label className="w-32">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue>
                          {selectedStatus?.lookupDescription || 'Select Status'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status Options</SelectLabel>
                          {statuses.map((s) => (
                            <SelectItem key={s._id} value={s.lookupValue}>
                              {s.lookupDescription}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                className={cn('w-full md:w-1/2', '')}
                disabled={
                  !paymentMethod || !dineMode || !customerName || isProcessing
                }
                onClick={handleDuplicateOrder}
                variant="outline"
              >
                {isProcessing ? 'Processing...' : 'Duplicate'}
              </Button>

              <Button
                className={cn('w-full md:w-1/2', '')}
                disabled={
                  !paymentMethod || !dineMode || !customerName || isProcessing
                }
                onClick={handleSaveOrder}
              >
                {isProcessing ? 'Processing...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* Right Side - cart */}
        <div className="col-span-1 h-full">
          <OrdersIdLines
            orderType={order.type || ''}
            onCheckout={true}
            orderLines={order.orderLines || []}
            totalAmount={order.totalAmount || 0}
            order={order}
            setOrder={setOrder}
          />
        </div>
      </div>
      <>
        <KeyboardTouchLettersDialog
          currentValue={customerName || ''}
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
