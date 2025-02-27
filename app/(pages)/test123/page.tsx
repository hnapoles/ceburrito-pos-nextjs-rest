'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray } from 'react-hook-form';
import { OrderBase, OrderZodSchema } from '@/app/models/orders-model';
import { OrderLineBase } from '@/app/models/orders-model';
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

export default function OrderForm({
  defaultValues,
}: {
  defaultValues?: Partial<OrderBase>;
}) {
  const form = useForm<OrderBase>({
    resolver: zodResolver(OrderZodSchema),
    defaultValues: defaultValues || {
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

            <FormField
              control={control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <Label>Total Amount</Label>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Label>Status</Label>
                  <FormControl>
                    <Input placeholder="Enter status" {...field} />
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
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-5 gap-2 items-end">
                <Controller
                  control={control}
                  name={`orderLines.${index}.productId`}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Product ID</Label>
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
                      <Label>Product Name</Label>
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
                      <Label>Quantity</Label>
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
                      <Label>Unit Price</Label>
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

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() =>
                append({
                  productId: '',
                  productName: '',
                  quantity: 1,
                  unitPrice: 1,
                })
              }
            >
              <Plus className="w-4 h-4" />
              Add Order Line
            </Button>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Submit Order
        </Button>
      </form>
    </Form>
  );
}
