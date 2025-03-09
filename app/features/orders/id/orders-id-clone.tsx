'use client';

import { useRouter } from 'next/navigation';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell,
} from '@/components/ui/table';

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

import Image from 'next/image';
import { CreateOrder } from '@/app/actions/server/orders-actions';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { Input } from '@/components/ui/input';
import KeyboardTouchEmailDialog from '@/app/features/keyboard/keyboard-touch-email-dialog';
import KeyboardTouchLettersDialog from '@/app/features/keyboard/keyboard-touch-letters-dialog';
import { Loader2 } from 'lucide-react';

export default function OrdersByIdClone({
  dineModes,
  paymentMethods,
  statuses,
  order,
}: {
  dineModes: Lookup[];
  paymentMethods: Lookup[];
  statuses: Lookup[];
  order: OrderBase;
}) {
  const router = useRouter();

  const [status, setStatus] = React.useState(order.status);
  const selectedStatus = statuses.find((s) => s.lookupValue === status);

  const [customerName, setCustomerName] = React.useState(
    order.customerName || '',
  );

  const [customerEmail, setCustomerEmail] = React.useState(
    order.customerEmail || '',
  );
  const [customerAddress, setCustomerAddress] = React.useState(
    order.customerAddress || 'n/a',
  );

  const [isNameTouchDialogOpen, setIsNameTouchDialogOpen] =
    React.useState(false);
  const [isEmailTouchDialogOpen, setIsEmailTouchDialogOpen] =
    React.useState(false);

  const [isProcessing, setIsProcessing] = React.useState(false);

  const [dineMode, setDineMode] = React.useState(order.mode);
  const selectedMode = dineModes.find((mode) => mode.lookupValue === dineMode);

  const [paymentMethod, setPaymentMethod] = React.useState(order.paymentMethod);

  const [paymentReference, setPaymentReference] = React.useState(
    order.paymentReference || 'n/a',
  );

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

  const orderIdWithDashes = `${(order._id || '').slice(0, 4)}-${(
    order._id || ''
  ).slice(4, -4)}-${(order._id || '').slice(-4)}`;

  const lineItemCount = (order.orderLines || [])
    .filter((line) => (line.status ?? 'open') !== 'canceled') // Default status to "open"
    .reduce((sum, line) => sum + line.quantity, 0);

  const handleSave = async () => {
    setIsProcessing(true);

    const newOrder: OrderBase = {
      orderedAt: new Date().toISOString(),
      type: order.type,
      mode: dineMode,
      paymentMethod: paymentMethod,
      status: 'open',
      storeName: order.storeName,
      customerName: customerName,
      customerEmail: customerEmail,
      totalAmount: order.totalAmount,
      orderLines: order.orderLines,
    };

    await CreateOrder(newOrder);

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
        {/* items */}
        <div className="flex flex-col h-full flex-1">
          <div className="flex items-center">
            <p className="text-base font-semibold">Items</p>
          </div>
          <div className="border border-sm rounded-sm p-4 flex-1 overflow-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Spice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderLines?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {row.imageUrl ? (
                        <Image
                          alt="User image"
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={row.imageUrl}
                          width="64"
                        />
                      ) : null}
                    </TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.sizeOption}</TableCell>
                    <TableCell>{row.spiceOption || 'n/a'}</TableCell>
                    <TableCell>{row.status || 'open'}</TableCell>
                    <TableCell className="text-right">
                      {formatPesoNoDecimals(Math.floor(row.unitPrice || 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.status === 'canceled' ? 0 : row.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPesoNoDecimals(
                        row.status === 'canceled'
                          ? 0
                          : Math.floor(row.unitPrice * row.quantity),
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="mt-4">
                  <TableCell className="font-medium text-right" colSpan={6}>
                    Total
                  </TableCell>
                  <TableCell className="text-right text-gray-900">
                    {lineItemCount}
                  </TableCell>
                  <TableCell className="text-right text-gray-900">
                    {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        {/* END items */}
        {/* information */}
        <div className="grid grid-cols-1 gap-4 text-sm">
          {/* order */}
          <div className="flex flex-col h-full">
            <div className="flex items-center">
              <p className="text-base font-semibold">Clone from Order</p>
            </div>

            <div className="border border-sm rounded-sm p-4 flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">Id</span>
                <span className="text-right text-gray-900">
                  {orderIdWithDashes.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Order Date</span>
                <span className="text-right text-gray-900">
                  {order.orderedAt
                    ? new Date(order.orderedAt).toLocaleString()
                    : 'n/a'}
                </span>
              </div>
              <div className="flex justify-between items-center">
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
                <span className="font-medium">Order Type</span>
                <span className="text-right text-red-700">{order.type}</span>
              </div>
            </div>
          </div>
          {/* END order */}

          {/* customer */}
          <div className="flex flex-col h-full">
            <div className="text-base font-semibold">Customer</div>
            <div className="border border-sm rounded-sm p-4 flex-1 space-y-1">
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
              <div className="flex justify-between items-center">
                <span className="font-medium">Address</span>
                <Input
                  type="text"
                  id="customerAddress"
                  value={customerAddress}
                  readOnly={order.type === 'pos'}
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
                <Select
                  value={dineMode}
                  onValueChange={setDineMode}
                  disabled={order.status !== 'open'}
                >
                  <SelectTrigger className="w-2/3 md:w-1/2">
                    <SelectValue>
                      {selectedMode?.lookupDescription || 'Select Dine Mode'}
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
              <div className="flex justify-between items-center">
                <span className="font-medium">Store Name</span>
                <span className="text-right text-red-700">
                  {order.storeName}
                </span>
              </div>
            </div>
          </div>
          {/* END customer */}

          {/* payment */}
          <div className="flex flex-col h-full">
            <div className="text-base font-semibold">Payment</div>
            <div className="border border-sm rounded-sm p-4 flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">Payment Method</span>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  disabled={order.status !== 'open'}
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
              <div className="flex justify-between items-center">
                <span className="font-medium">Reference</span>
                <Input
                  type="text"
                  id="paymentReference"
                  value={paymentReference}
                  readOnly={paymentMethod === 'cash'}
                  className="w-2/3 md:w-1/2"
                  placeholder="Enter payment reference"
                  onChange={(e) => setPaymentReference(e.target.value)}
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
                  {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
                </span>
              </div>
            </div>
          </div>
          {/* END payment */}
        </div>
        {/* END information */}
      </div>
      {/* END grid grid-cols-1 lg:grid-cols-2 */}
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
