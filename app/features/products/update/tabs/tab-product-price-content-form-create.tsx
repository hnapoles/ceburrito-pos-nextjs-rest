import React, { useEffect, useState, useCallback } from 'react';

import { useDialogStore } from '@/app/providers/zustand-provider';

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
  ProductZodSchema,
  ProductDataBase,
  ProductSellingPriceDataBase,
  ProductSellingPriceZodSchema,
} from '@/app/models/products-model';

import { UpdateProduct } from '@/app/actions/server/products-actions';

import { useGlobalStore } from '@/app/providers/zustand-provider';

import {
  GetLookupCustomers,
  GetLookupsOrderTypes,
  GetLookupStores,
} from '@/app/actions/server/lookups-actions';
import { Lookup } from '@/app/models/lookups-model';
import { CustomerDataBase } from '@/app/models/customers-model';
import { StoreData } from '@/app/models/stores-model';
import {
  CreateProductSellingPrices,
  GetProductSellingPricesByOwnId,
} from '@/app/actions/server/product-selling-prices-actions';

export default function TabProductPricesFormUpdate({
  setRefresh,
  dialogId,
}: {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  dialogId: string;
}) {
  /*
    const id = useDialogStore((state) => {
    state.updateDialogId;
  });
  */

  const [orderTypes, setOrderTypes] = useState<Lookup[]>([]);

  const [customers, setCustomers] = useState<CustomerDataBase[]>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');

  // Handle change in customer selection
  const handleCustomerChange = (selectedName: string) => {
    setSelectedCustomerName(selectedName);

    // Find the corresponding customerId based on the selected customerName
    const selectedCustomer = customers.find(
      (customer) => customer.name === selectedName,
    );
    if (selectedCustomer && selectedCustomer._id) {
      setCustomerId(selectedCustomer._id);
    }
  };

  const [stores, setStores] = useState<StoreData[]>([]);
  const [storeId, setStoreId] = useState<string>('');
  const [selectedStoreName, setSelectedStoreName] = useState<string>('');
  // Handle change in store selection
  const handleStoreChange = (selectedName: string) => {
    setSelectedStoreName(selectedName);

    // Find the corresponding customerId based on the selected customerName
    const selectedStore = stores.find((store) => store.name === selectedName);
    if (selectedStore && selectedStore._id) {
      setStoreId(selectedStore._id);
    }
  };

  const [prices, setPrices] = useState<ProductSellingPriceDataBase>();

  /*
  const fetchData = useCallback(async () => {
    const res1 = await GetLookupsOrderTypes();
    setOrderTypes(res1.data);
    const res2 = await GetLookupCustomers('', '1', '99999');
    setCustomers(res2.data);
    const res3 = await GetLookupStores('', '1', '99999');
    setStores(res3.data);
    const prices = await GetProductSellingPricesByOwnId(dialogId);
    setPrices(prices);
  }, []); // ✅ No dependencies
  */
  if (!dialogId) {
    return <div>Loading...</div>;
  }
  const fetchData = useCallback(async () => {
    try {
      const [res1, res2, res3, priceRes] = await Promise.all([
        GetLookupsOrderTypes(),
        GetLookupCustomers('', '1', '99999'),
        GetLookupStores('', '1', '99999'),
        GetProductSellingPricesByOwnId(dialogId),
      ]);

      setOrderTypes(res1.data);
      setCustomers(res2.data);
      setStores(res3.data);
      setPrices(priceRes); // Avoid unnecessary re-renders
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [dialogId]); // ✅ Add `dialogId` as a dependency

  useEffect(() => {
    fetchData();
  }, [dialogId]);

  console.log('p ', prices);

  const defaultValues: ProductSellingPriceDataBase = {
    _id: dialogId ?? undefined,
    productId: prices?.productId,
    orderType: prices?.orderType || '',
    storeName: prices?.storeName || '',
    sellingPrice: prices?.sellingPrice || undefined,
  };

  const form = useForm<ProductSellingPriceDataBase>({
    resolver: zodResolver(ProductSellingPriceZodSchema),
    defaultValues: defaultValues,
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    reset,
    resetField,
    formState: {
      //errors,
      isSubmitting,
    },
  } = form;

  async function onSubmit(data: ProductSellingPriceDataBase) {
    //delete data._id;
    //const productCreated = await CreateProduct(data);
    console.log('Submitting...');
    delete data._id;
    data = {
      ...data,
      customerName: selectedCustomerName,
      customerId: customerId,
      storeName: selectedStoreName,
      storeId: storeId,
      productId: product?._id,
      productName: product?.name,
    };

    console.log(data);

    const createdData = await CreateProductSellingPrices(data);

    toast({
      title: 'Data saved',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(createdData, null, 2)}
          </code>
        </pre>
      ),
    });

    setRefresh(true);
    toggleUpdateDialog();

    //revalidateAndRedirectUrl('/dashboard/products');
  }

  const product = useGlobalStore((state) => state.product);

  const { isUpdateDialogOpen, closeUpdateDialog, toggleUpdateDialog } =
    useDialogStore();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Id</FormLabel>

              {/*<Input placeholder="" readOnly {...field} />
                  <FormDescription>
                    This is a system generated id .
                  </FormDescription>
                  <FormMessage />
                  */}
            </FormItem>
          )}
        />
        <FormLabel>{dialogId}</FormLabel>
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
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <Select onValueChange={handleStoreChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store name" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stores.map((s) => (
                    <SelectItem key={s._id} value={s.name}>
                      {s.name}
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
              <Select
                value={selectedCustomerName}
                onValueChange={handleCustomerChange}
              >
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

        {/*
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
            */}
        <FormField
          control={form.control}
          name="sellingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                step="0.01" // Allows decimals
                placeholder=""
                value={field.value ?? ''} // Ensures the input field shows empty when undefined
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow empty input (user deletes the value)
                  if (value === '') {
                    field.onChange(undefined); // Pass undefined instead of an empty string
                    return;
                  }

                  // Convert input to a valid number
                  const numericValue = parseFloat(value);

                  if (!isNaN(numericValue)) {
                    field.onChange(numericValue); // Ensure a number is passed
                  }
                }}
                onBlur={() => {
                  if (field.value !== undefined && !isNaN(field.value)) {
                    field.onChange(parseFloat(field.value.toFixed(2))); // Maintain numeric type
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
            onClick={toggleUpdateDialog}
          >
            {isSubmitting ? 'Submitting...' : 'Cancel'}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
