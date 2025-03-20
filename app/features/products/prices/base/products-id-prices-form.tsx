import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  //CardTrigger,
} from '@/components/ui/card-rounded-sm';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button-rounded-sm';
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

import { Lookup } from '@/app/models/lookups-model';
import { CustomerBase } from '@/app/models/customers-model';
//import { StoreBase } from '@/app/models/stores-model';
import {
  CreateProductSellingPrices,
  UpdateProductSellingPriceById,
} from '@/app/actions/server/product-selling-prices-actions';
import { OrganizationBase } from '@/app/models/organizations-model';

export default function ProductsByIdPricesFormBase({
  product,
  initialData,
  orderTypes,
  customers,
  stores,
}: {
  product: ProductBase;
  initialData?: ProductSellingPriceBase;
  orderTypes: Lookup[];
  sizeOptions?: Lookup[];
  customers: CustomerBase[];
  stores: OrganizationBase[];
}) {
  //const pathname = usePathname();
  const router = useRouter();

  const defaultValues = initialData || {
    _id: '',
    productId: '',
    orderType: '',
    storeName: '',
    sellingPrice: undefined,
  };

  //slow fetching in client - need to transfer this to server side for faster response time
  /*
  const [loading, setLoading] = useState<boolean>(true); 
  const [orderTypes, setOrderTypes] = useState<Lookup[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Lookup[]>([]);
  const [customers, setCustomers] = useState<CustomerBase[]>([]);
  const [stores, setStores] = useState<StoreBase[]>([]);
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
  */

  const [customerId, setCustomerId] = useState<string>('');
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');

  // Handle change in customer selection
  const handleCustomerChange = (selectedName: string) => {
    setSelectedCustomerName(selectedName);

    form.setValue('customerName', selectedName);

    // Find the corresponding customerId based on the selected customerName
    const selectedCustomer = customers.find(
      (customer) => customer.name === selectedName,
    );
    if (selectedCustomer && selectedCustomer._id) {
      setCustomerId(selectedCustomer._id);
    }
  };

  const [storeId, setStoreId] = useState<string>('');
  const [selectedStoreName, setSelectedStoreName] = useState<string>('');
  // Handle change in store selection
  const handleStoreChange = (selectedName: string) => {
    setSelectedStoreName(selectedName);
    form.setValue('storeName', selectedName);

    // Find the corresponding customerId based on the selected customerName
    const selectedStore = stores.find((store) => store.name === selectedName);
    if (selectedStore && selectedStore._id) {
      setStoreId(selectedStore._id);
    }
  };

  const form = useForm<ProductSellingPriceBase>({
    resolver: zodResolver(ProductSellingPriceZodSchema),
    defaultValues: defaultValues,
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
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

  const [showDialog, setShowDialog] = useState(false);

  const handleCancel = () => {
    if (isDirty) {
      setShowDialog(true); // Show confirmation modal if form is dirty
    } else {
      router.back(); // If no changes, navigate back
    }
  };

  const discardChanges = () => {
    setShowDialog(false);
    router.back();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Product Prices' : 'New Product Prices'}
        </CardTitle>
        <CardDescription>
          {`product name `}
          <strong>{product?.name}</strong>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
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
                      {product.sizeOptions?.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
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
              */}

            <FormField
              control={form.control}
              name="sellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder=""
                    {...field}
                    value={field.value || ''}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting || !isDirty || Object.keys(errors).length > 0
                }
              >
                {isSubmitting ? 'Submitting...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter></CardFooter>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard Changes?</DialogTitle>
          </DialogHeader>
          <p>
            You have unsaved changes. Are you sure you want to discard them?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              No, Keep Editing
            </Button>
            <Button variant="destructive" onClick={discardChanges}>
              Yes, Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
