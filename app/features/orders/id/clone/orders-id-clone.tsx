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

  const [customerName, setCustomerName] = React.useState(
    order.customerName || '',
  );
  console.log('customerName ', customerName);
  const [customerEmail, setCustomerEmail] = React.useState(
    order.customerEmail || '',
  );
  const [customerAddress, setCustomerAddress] = React.useState(
    order.customerAddress || '',
  );

  const [isNameTouchDialogOpen, setIsNameTouchDialogOpen] =
    React.useState(false);
  const [isEmailTouchDialogOpen, setIsEmailTouchDialogOpen] =
    React.useState(false);

  const [isProcessing, setIsProcessing] = React.useState(false);

  const [dineMode, setDineMode] = React.useState(order.mode);
  const selectedMode = dineModes.find((mode) => mode.lookupValue === dineMode);

  const [paymentMethod, setPaymentMethod] = React.useState(order.paymentMethod);

  console.log(paymentMethods, dineModes);

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
    router.push(`/orders`);
  };

  return (
    <div className="relative gap-4 bg-white border border-sm rounded-sm p-4">
      {/* grid grid-cols-1 lg:grid-cols-2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        {/* items */}
        <div className="flex flex-col h-full flex-1">
          <div className="flex items-center">
            <p className="text-lg">Items</p>
          </div>
          <div className="border border-sm rounded-sm p-4 flex-1 overflow-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Spice</TableHead>
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
                    <TableCell>{row.spiceOption || 'n/na'}</TableCell>
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
                  <TableCell className="font-medium text-right" colSpan={5}>
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
        <div className="grid grid-cols-1 gap-4">
          {/* order */}
          <div className="flex flex-col h-full">
            <div className="flex items-center">
              <p className="text-lg">Clone Order</p>
            </div>

            <div className="border border-sm rounded-sm p-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">From Id</span>
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
                <span className="text-right text-gray-900 ml-2">
                  {order.status.toUpperCase()}
                </span>
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
            <div>Customer</div>
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
                  readOnly
                  className="w-2/3 md:w-1/2"
                  placeholder="Enter address"
                  onClick={() => setIsNameTouchDialogOpen(true)}
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
                <span className="text-right text-gray-900">
                  {order.storeName}
                </span>
              </div>
            </div>
          </div>
          {/* END customer */}
          {/* payment */}
          <div className="flex flex-col h-full">
            <div>Payment</div>
            <div className="border border-sm rounded-sm p-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">Payment Method</span>
                <span className="text-right text-gray-900">
                  {order.paymentMethod?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Reference</span>
                <span className="text-right text-gray-900">
                  {order.paymentReference ?? 'n/a'}
                </span>
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
          onClick={() => handleSave()}
        >
          Cancel
        </Button>

        <Button
          className="w-full md:w-[100px]"
          onClick={handleSave}
          disabled={isProcessing} // Disable when processing
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              <span>Processing...</span>
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
    </div>
  );
}
