'use client';

import { useRouter } from 'next/navigation';

/*
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
*/

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button-rounded-sm';

import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import { Lookup } from '@/app/models/lookups-model';
import React from 'react';

import { OrderBase } from '@/app/models/orders-model';

import { CreateOrder } from '@/app/actions/server/orders-actions';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { Input } from '@/components/ui/input';
import KeyboardTouchEmailDialog from '@/app/features/keyboard/keyboard-touch-email-dialog';
import KeyboardTouchLettersDialog from '@/app/features/keyboard/keyboard-touch-letters-dialog';
import { Loader2 } from 'lucide-react';
import KeyboardTouchNumbersDialog from '../../keyboard/keyboard-touch-numbers-dialog';
import KeyboardTouchCashTendered from '../../keyboard/keyboard-touch-cash-tendered';
import { useCartStore, useStoreName } from '@/app/providers/zustand-provider';
import OrdersCartDetails from '../base/orders-cart-details';
import { cn } from '@/lib/utils';

//
//start of default function
//
export default function OrdersCheckout({
  dineModes,
  paymentMethods,
  statuses,
  orderType,
}: {
  dineModes: Lookup[];
  paymentMethods: Lookup[];
  statuses: Lookup[];
  orderType: string;
}) {
  const router = useRouter();

  const { clearCart } = useCartStore();

  const [status, setStatus] = React.useState('open');
  const selectedStatus = statuses.find((s) => s.lookupValue === status);

  const [customerName, setCustomerName] = React.useState('');

  const [customerEmail, setCustomerEmail] = React.useState('');
  const [customerAddress, setCustomerAddress] = React.useState('');

  const [isNameTouchDialogOpen, setIsNameTouchDialogOpen] =
    React.useState(false);
  const [isEmailTouchDialogOpen, setIsEmailTouchDialogOpen] =
    React.useState(false);
  const [isPayRefTouchDialogOpen, setIsPayRefTouchDialogOpen] =
    React.useState(false);
  const [isCashTendTouchDialogOpen, setIsCashTendTouchDialogOpen] =
    React.useState(false);

  const [cashTendered, setCashTendered] = React.useState('');

  const [isProcessing, setIsProcessing] = React.useState(false);

  const [dineMode, setDineMode] = React.useState('');
  //const selectedMode = dineModes.find((mode) => mode.lookupValue === dineMode);

  const [paymentMethod, setPaymentMethod] = React.useState('');

  const handlePaymentMethod = (value: string) => {
    if (value) {
      setPaymentMethod(value);
      if (value === 'cash') {
        setIsCashTendTouchDialogOpen(true);
      } else {
        setIsPayRefTouchDialogOpen(true);
      }
    }
  };

  const [paymentReference, setPaymentReference] = React.useState('');

  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  /*
  const isInitialRender = React.useRef(true);

  React.useEffect(() => {
    if (isInitialRender.current) {
      setCustomerName(order.customerName || '');
      setCustomerEmail(order.customerEmail || '');
      setCustomerAddress(order.customerAddress || '');
      setDineMode(order.mode);
      setPaymentMethod(order.paymentMethod);
      isInitialRender.current = false; // Mark initial render as done
    }
  }, [order]); // Runs only when `order` changes
 */

  //const [order, setOrder] = React.useState(orderData);

  const { storeName } = useStoreName();
  const { orderLines } = useCartStore();

  const totalAmount = useCartStore((state) => state.totalAmount());
  const lineItemCount = useCartStore((state) => state.totalItems());

  const handleSave = async () => {
    setIsProcessing(true);

    const newOrder: OrderBase = {
      //_id: order._id,
      orderedAt: new Date().toISOString(),
      paymentMethod: paymentMethod,
      paymentReference: paymentReference,
      mode: dineMode,
      status: 'open',
      customerName: customerName,
      customerEmail: customerEmail,
      totalAmount: totalAmount,
      type: orderType,
      orderLines: orderLines,
    };

    await CreateOrder(newOrder);

    clearCart();
    setIsProcessing(false);
    await revalidateAndRedirectUrl('/orders');
  };

  const handleCancel = async () => {
    setShowCancelDialog(true);
  };

  const discardChanges = () => {
    setShowCancelDialog(false);
    router.back();
  };

  return (
    <div className="relative gap-4 bg-white border border-sm rounded-sm p-4">
      {/* grid grid-cols-1 lg:grid-cols-2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        {/* cart */}
        <div className="col-span-1 h-full">
          <OrdersCartDetails orderType={orderType} />
        </div>
        {/* END cart */}
        {/* information */}
        <div className="grid grid-cols-1 gap-4 text-sm">
          {/* order */}
          <div className="flex flex-col h-full">
            <div className="border border-sm rounded-sm p-4 flex-1 space-y-1">
              <div className="flex items-center">
                <p className="text-base font-semibold">Checkout</p>
              </div>
              <div className="flex justify-between items-center hidden">
                <span className="font-medium">Status</span>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-2/3 md:w-1/2">
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
              <div className="flex justify-between items-center">
                <span className="font-medium">Store Name</span>
                <span className="text-right text-red-700">{storeName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Type</span>
                <span className="text-right">{orderType.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Customer Name</span>
                <Input
                  type="text"
                  id="customerName"
                  value={customerName}
                  readOnly
                  className="w-2/3 md:w-1/2"
                  placeholder="Enter name"
                  onClick={() => setIsNameTouchDialogOpen(true)}
                />
              </div>
              <div
                className={cn(
                  'flex justify-between items-center',
                  orderType === 'pos' ? 'hidden' : '',
                )}
              >
                <span className="font-medium">Address</span>
                <Input
                  type="text"
                  id="customerAddress"
                  value={customerAddress}
                  readOnly={orderType === 'pos'}
                  className="w-2/3 md:w-1/2"
                  placeholder="Enter address"
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Email</span>
                <Input
                  type="email"
                  id="customerEmail"
                  value={customerEmail}
                  placeholder="Enter email"
                  readOnly
                  className="w-2/3 md:w-1/2"
                  onClick={() => setIsEmailTouchDialogOpen(true)}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Mode</span>
                <Select value={dineMode} onValueChange={setDineMode}>
                  <SelectTrigger className="w-2/3 md:w-1/2">
                    <SelectValue placeholder="Select Dine Mode" />
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
              <div className="flex justify-between items-center">
                <span className="font-medium">Payment Method</span>
                <Select
                  value={paymentMethod}
                  onValueChange={handlePaymentMethod}
                >
                  <SelectTrigger className="w-2/3 md:w-1/2">
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Payment Options</SelectLabel>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method._id} value={method.lookupValue}>
                          {method.lookupDescription}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div
                className={
                  paymentMethod !== 'cash'
                    ? 'flex justify-between items-center'
                    : 'hidden'
                }
              >
                <span className="font-medium">Reference</span>
                <Input
                  type="text"
                  id="paymentReference"
                  value={paymentReference}
                  readOnly={paymentMethod === 'cash'}
                  className="w-2/3 md:w-1/2"
                  placeholder="Enter payment reference"
                  onChange={(e) => setPaymentReference(e.target.value)}
                  onClick={() => setIsPayRefTouchDialogOpen(true)}
                />
              </div>
              <div
                className={
                  paymentMethod === 'cash'
                    ? 'flex justify-between items-center'
                    : 'hidden'
                }
              >
                <span className="font-medium">Cash Tendered</span>
                <Input
                  type="text"
                  id="cashTendered"
                  value={formatPesoNoDecimals(parseFloat(cashTendered))}
                  readOnly={paymentMethod !== 'cash'}
                  className="w-2/3 md:w-1/2 text-right"
                  placeholder="Enter cash tendered"
                  onChange={(e) => setCashTendered(e.target.value)}
                  onClick={() => setIsCashTendTouchDialogOpen(true)}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Items</span>
                <span className="text-right text-gray-900">
                  {lineItemCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-right text-red-700">
                  {formatPesoNoDecimals(Math.floor(totalAmount || 0))}
                </span>
              </div>
            </div>
          </div>
          {/* END order */}
        </div>
        {/* END information */}
      </div>
      {/* END grid grid-cols-1 lg:grid-cols-2 */}
      {/** 
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-end gap-2 mt-2 mr-2">
          <Button
            variant="outline"
            className="w-full md:w-[120px]"
            onClick={() => router.push(`/orders/create/${orderType}`)}
          >
            Add More
          </Button>
        </div>
        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            variant="outline"
            className="w-full md:w-[100px]"
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>

          <Button
            className="w-full md:w-[100px]"
            onClick={handleSave}
            disabled={
              !paymentMethod || !dineMode || !customerName || isProcessing
            } // Disable when processing
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                <span></span>
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>
      */}
      {/* Floater - Order Summary */}
      <div className="fixed bottom-0 left-0 w-full bg-white px-2 sm:px-4 py-2 shadow-md border-t border-black-900 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-x-4 lg:justify-between">
        {/* Left Section - Items & Order Details */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 overflow-hidden w-full sm:w-auto">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="font-medium whitespace-nowrap text-sm sm:text-base">
              Items (<span className="text-purple-700">{lineItemCount}</span>):
            </span>
            <span className="text-purple-700 text-sm sm:text-base">
              {formatPesoNoDecimals(Math.floor(totalAmount))}
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 mt-1 sm:mt-0">
            <span className="font-medium whitespace-nowrap text-sm sm:text-base">
              Order Type:
            </span>
            <span className="text-purple-700 text-sm sm:text-base">
              {orderType.toUpperCase()}
            </span>
          </div>

          {/* Add More Items Button (Moves Below on Small Screens) */}
          <Button
            variant="outline"
            className="w-full sm:w-[120px] mt-2 sm:mt-0"
            onClick={() => router.push(`/orders/create/${orderType}`)}
          >
            Add More Items
          </Button>
        </div>

        {/* Right Section - Cancel & Save Buttons (Move to Right on lg+) */}
        <div className="grid grid-cols-2 sm:flex flex-1 w-full sm:w-auto gap-2 lg:flex-row lg:justify-end lg:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-[100px]"
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-[100px]"
            onClick={handleSave}
            disabled={
              !paymentMethod || !dineMode || !customerName || isProcessing
            } // Disable when processing
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                <span></span>
              </>
            ) : (
              'Save'
            )}
          </Button>
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
        <KeyboardTouchNumbersDialog
          currentValue={paymentReference || ''}
          setTouchValue={setPaymentReference}
          setIsTouchDialogOpen={setIsPayRefTouchDialogOpen}
          isTouchDialogOpen={isPayRefTouchDialogOpen}
        />
        <KeyboardTouchCashTendered
          currentValue={cashTendered}
          setTouchValue={setCashTendered}
          setIsTouchDialogOpen={setIsCashTendTouchDialogOpen}
          isTouchDialogOpen={isCashTendTouchDialogOpen}
          title={'Cash Tendered'}
          amountDue={totalAmount || 0}
        />
      </>
      {/* Discard Changes Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard Changes?</DialogTitle>
          </DialogHeader>
          <p>
            You have unsaved changes. Are you sure you want to discard them?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              No, Keep Editing
            </Button>
            <Button variant="destructive" onClick={discardChanges}>
              Yes, Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
