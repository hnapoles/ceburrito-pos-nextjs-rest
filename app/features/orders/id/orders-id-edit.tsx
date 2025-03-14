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
import { UpdateOrder } from '@/app/actions/server/orders-actions';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';
import { Input } from '@/components/ui/input';
import KeyboardTouchEmailDialog from '@/app/features/keyboard/keyboard-touch-email-dialog';
import KeyboardTouchLettersDialog from '@/app/features/keyboard/keyboard-touch-letters-dialog';
import { Loader2 } from 'lucide-react';
import KeyboardTouchNumbersDialog from '../../keyboard/keyboard-touch-numbers-dialog';
import KeyboardTouchCashTendered from '../../keyboard/keyboard-touch-cash-tendered';

export default function OrdersByIdEdit({
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
  const [isPayRefTouchDialogOpen, setIsPayRefTouchDialogOpen] =
    React.useState(false);
  const [isCashTendTouchDialogOpen, setIsCashTendTouchDialogOpen] =
    React.useState(false);

  const [cashTendered, setCashTendered] = React.useState('');

  const [isProcessing, setIsProcessing] = React.useState(false);

  const [dineMode, setDineMode] = React.useState(order.mode);
  const selectedMode = dineModes.find((mode) => mode.lookupValue === dineMode);

  const [paymentMethod, setPaymentMethod] = React.useState(order.paymentMethod);

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

    const updatedData: OrderBase = {
      _id: order._id,
      paymentMethod: paymentMethod,
      paymentReference: paymentReference,
      mode: dineMode,
      status: status,
      customerName: customerName,
      customerEmail: customerEmail,
      totalAmount: order.totalAmount,
      type: order.type,
    };

    await UpdateOrder(updatedData);

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
            {/** 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/orders/${order._id}/addItems`)}
                  >
                    <p className="text-base font-semibold">Items</p>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Click to Manage Items</TooltipContent>
              </Tooltip>
            </TooltipProvider>*/}
          </div>
          <div className="border border-sm rounded-sm p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden lg:table-cell">Size</TableHead>
                  <TableHead className="hidden lg:table-cell">Spice</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
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
                    <TableCell>
                      <div className="grid grid-cols-1">
                        <div>{row.productName}</div>
                        <div className="flex lg:hidden">
                          {row.sizeOption} {row.spiceOption}
                        </div>
                        <div className="flex lg:hidden">
                          status:{row.status || 'open'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {row.sizeOption || '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {row.spiceOption || '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {row.status || 'open'}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPesoNoDecimals(Math.floor(row.unitPrice || 0))}
                    </TableCell>
                    <TableCell className="text-right">{row.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatPesoNoDecimals(
                        Math.floor(row.unitPrice * row.quantity || 0),
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="mt-4">
                  <TableCell className="hidden lg:table-cell">
                    <span></span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span></span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span></span>
                  </TableCell>
                  <TableCell className="font-medium text-right" colSpan={3}>
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
              <p className="text-base font-semibold">Edit Order</p>
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
                  onValueChange={handlePaymentMethod}
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
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-end gap-2 mt-2 mr-2">
          <Button
            variant="outline"
            className="w-full md:w-[120px]"
            onClick={() => router.push(`/orders/${order._id}/addItems`)}
          >
            Manage Items
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
          amountDue={order.totalAmount || 0}
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
