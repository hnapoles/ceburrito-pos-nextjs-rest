import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // Import a loading spinner icon
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  //CardTrigger,
} from '@/components/ui/card';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  //FormDescription,
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
  ProductBase,
  //ProductZodSchema,
  //ProductBase,
  ProductSellingPriceBase,
  ProductSellingPriceZodSchema,
} from '@/app/models/products-model';

import { GetLookups } from '@/app/actions/server/lookups-actions';
import { DefaultSizeOptions } from '@/app/models/lookups-model';

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
  UpdateProductSellingPriceById,
} from '@/app/actions/server/product-selling-prices-actions';

export default function ProductsByIdPricesFormBase({
  product,
  initialData,
}: {
  product: ProductBase;
  initialData?: ProductSellingPriceBase;
}) {
  const pathname = usePathname();

  const [loading, setLoading] = useState<boolean>(true); // Loader for data fetching

  const defaultValues = initialData || {
    _id: '',
    productId: '',
    orderType: '',
    storeName: '',
    sellingPrice: undefined,
  };

  const [orderTypes, setOrderTypes] = useState<Lookup[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Lookup[]>([]);

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

  const fetchData = useCallback(async () => {
    setLoading(true); // Start loading
    const orderTypes = await GetLookupsOrderTypes();
    setOrderTypes(orderTypes);
    const customers = await GetLookupCustomers();
    setCustomers(customers);
    const stores = await GetLookupStores();
    setStores(stores);
    let { data: sizeOptionsLookup } = await GetLookups('order', 'sizeOptions');
    if (!sizeOptionsLookup || sizeOptionsLookup.length <= 0)
      sizeOptionsLookup = DefaultSizeOptions;
    setSizeOptions(sizeOptionsLookup);
    setLoading(false); // Stop loading
  }, []); // ✅ No dependencies

  useEffect(() => {
    fetchData();
  }, []);

  const form = useForm<ProductSellingPriceBase>({
    resolver: zodResolver(ProductSellingPriceZodSchema),
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

  async function handleCreateRecord(data: ProductSellingPriceBase) {
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
    await revalidateAndRedirectUrl(`/products/${product._id}`);
  }

  async function handleUpdateRecord(data: ProductSellingPriceBase) {
    const id = data._id || '';
    delete data._id;
    data = {
      ...data,
      customerName: selectedCustomerName,
      customerId: customerId,
      storeName: selectedStoreName,
      storeId: storeId,
      productId: product._id,
      productName: product.name,
    };

    console.log(data);

    const updatedData = await UpdateProductSellingPriceById(id, data);

    toast({
      title: 'Data saved',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(updatedData, null, 2)}
          </code>
        </pre>
      ),
    });
    await revalidateAndRedirectUrl(`/products/${product._id}`);
  }

  async function onSubmit(data: ProductSellingPriceBase) {
    if (initialData) {
      handleUpdateRecord(data);
    } else {
      handleCreateRecord(data);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Product Prices' : 'New Product Prices'}
        </CardTitle>
        <CardDescription>
          {`product id [${product?._id}], name [${product?.name}]`}
        </CardDescription>
      </CardHeader>
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="orderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      {...field}
                      value={field.value || ''}
                    >
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
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      {...field}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizeOptions.map((l) => (
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
                    <Select
                      onValueChange={handleStoreChange}
                      {...field}
                      value={field.value || ''}
                    >
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
                      onValueChange={handleCustomerChange}
                      {...field}
                      value={field.value || ''}
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
                <Button variant="outline" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Cancel'}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      )}

      <CardFooter></CardFooter>
    </Card>
  );
}
