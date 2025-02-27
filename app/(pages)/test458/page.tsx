'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray } from 'react-hook-form';
import { OrderBase, OrderZodSchema } from '@/app/models/orders-model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash } from 'lucide-react';

const mockOrderDefaultValues = {
  _id: '65f123abcd456ef789012345', // Example MongoDB ObjectID
  type: 'Online',
  customerName: 'John Doe',
  description: 'Test order with multiple items',
  totalAmount: 150.75,
  status: 'Processing',
  orderedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'admin',
  updatedBy: 'admin',
  orderLines: [
    {
      productId: 'P001',
      productName: 'Product A',
      quantity: 2,
      unitPrice: 25.5,
      amount: 51.0,
    },
    {
      productId: 'P002',
      productName: 'Product B',
      quantity: 1,
      unitPrice: 50.0,
      amount: 50.0,
    },
    {
      productId: 'P003',
      productName: 'Product C',
      quantity: 3,
      unitPrice: 16.75,
      amount: 50.25,
    },
  ],
};

export default function OrderForm({
  defaultValues,
}: {
  defaultValues?: Partial<OrderBase>;
}) {
  const form = useForm<OrderBase>({
    resolver: zodResolver(OrderZodSchema),
    defaultValues: mockOrderDefaultValues || {
      type: '',
      customerName: '',
      description: '',
      totalAmount: 0,
      status: '',
      orderLines: [],
    },
  });

  const { control, handleSubmit, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orderLines',
  });

  const orderLines = watch('orderLines');
  const totalAmount = orderLines?.reduce(
    (sum, line) => sum + (line.quantity * line.unitPrice || 0),
    0,
  );

  const onSubmit = (data: OrderBase) => {
    console.log('Order Submitted:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Label>Order Type</Label>
                  <FormControl>
                    <Input placeholder="Enter order type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <Label>Customer Name</Label>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Order Lines */}
        <Card>
          <CardHeader>
            <CardTitle>Order Lines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {fields.length > 0 && (
              <div className="grid grid-cols-6 gap-2 font-medium text-sm">
                <Label>Product ID</Label>
                <Label>Product Name</Label>
                <Label>Quantity</Label>
                <Label>Unit Price</Label>
                <Label>Amount</Label>
                <span></span>
              </div>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-6 gap-2 items-center"
              >
                <Controller
                  control={control}
                  name={`orderLines.${index}.productId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Product ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  control={control}
                  name={`orderLines.${index}.productName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Product Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  control={control}
                  name={`orderLines.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  control={control}
                  name={`orderLines.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="1"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <span>{(field.quantity * field.unitPrice).toFixed(2)}</span>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-bold">{totalAmount?.toFixed(2)}</span>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Submit Order
        </Button>
      </form>
    </Form>
  );
}
