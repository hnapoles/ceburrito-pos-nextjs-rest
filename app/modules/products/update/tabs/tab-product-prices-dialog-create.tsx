import { useEffect, useState, useCallback } from 'react';

import { useDialogStore } from '@/app/provider/zustand-provider';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  //DialogTrigger,
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';

import {
  ZodSchemaProduct,
  ProductData,
  ProductSellingPricesData,
  ZodSchemaProductSellingPrices,
} from '@/app/model/products-model';

import { UpdateProduct } from '@/app/action/server/products-actions';

import { useGlobalStore } from '@/app/provider/zustand-provider';

const defaultValues: ProductSellingPricesData = {
  _id: '',
  productId: '',
  orderType: '',
  storeName: '',
  sellingPrice: 0.0,
};

import {
  GetLookupCustomers,
  GetLookupsOrderTypes,
} from '@/app/action/server/lookups-actions';
import { Lookup } from '@/app/model/lookups-model';
import { CustomerData } from '@/app/model/customers-model';

export default function TabProductPricesDialogCreate() {
  const [orderTypes, setOrderTypes] = useState<Lookup[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);

  const fetchData = useCallback(async () => {
    const res1 = await GetLookupsOrderTypes();
    setOrderTypes(res1.data);
    const res2 = await GetLookupCustomers('', '1', '99999');
    setCustomers(res2.data);
  }, []); // ✅ No dependencies

  useEffect(() => {
    fetchData();
  }, []);

  const form = useForm<ProductSellingPricesData>({
    resolver: zodResolver(ZodSchemaProductSellingPrices),
    defaultValues: defaultValues,
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: {
      //errors,
      isSubmitting,
    },
  } = form;

  async function onSubmit(data: ProductSellingPricesData) {
    //delete data._id;
    //const productCreated = await CreateProduct(data);
    console.log('Submitting...');

    toast({
      title: 'Data saved',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{data.orderType}</code>
        </pre>
      ),
    });

    toggleCreateDialog();

    //revalidateAndRedirectUrl('/dashboard/products');
  }

  const product = useGlobalStore((state) => state.product);

  const { isCreateDialogOpen, closeCreateDialog, toggleCreateDialog } =
    useDialogStore();

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={toggleCreateDialog}>
      {/*<DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product Prices</DialogTitle>
          <DialogDescription>
            {`Add product prices for product id[${product?._id}], name[${product?.name}]`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue="">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orderTypes.map((l) => (
                        <SelectItem key={l.lookupValue} value={l.lookupValue}>
                          {l.lookupDescription}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue="">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c._id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    step="0.01" // Allows decimals
                    placeholder="0.00"
                    value={field.value ? Number(field.value).toFixed(2) : ''}
                    onChange={(e) => {
                      const value = e.target.value; // Always a string from input
                      const numericValue = parseFloat(value);

                      // Ensure valid numeric input
                      if (!isNaN(numericValue)) {
                        field.onChange(numericValue.toFixed(2)); // Pass as string
                      } else {
                        field.onChange(''); // Handle empty input
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={toggleCreateDialog}
              >
                {isSubmitting ? 'Submitting...' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
