import { useState, useCallback, useEffect } from 'react';

import { shallow } from 'zustand/shallow';

import Link from 'next/link';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import ProductPricesContentTableRow from './tab-product-prices-content-table-row';
import TabProductPricesDialogCreate from './tab-product-prices-content-dialog-create';
import TabProductPricesDialogUpdate from './tab-product-prices-content-dialog-update';
import TabProductPricesFormUpdate from './tab-product-price-content-form-create';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { PlusCircle } from 'lucide-react';
import { useDialogStore } from '@/app/provider/zustand-provider';

import { useGlobalStore } from '@/app/provider/zustand-provider';

import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ProductSellingPricesData } from '@/app/model/products-model';
import { GetProductSellingPricesByProductId } from '@/app/action/server/product-selling-prices-actions';

import { Label } from '@/components/ui/label';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { toast } from '@/hooks/use-toast';

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
  ZodSchemaProductSellingPrices,
} from '@/app/model/products-model';

import { UpdateProduct } from '@/app/action/server/products-actions';

import {
  GetLookupCustomers,
  GetLookupsOrderTypes,
  GetLookupStores,
} from '@/app/action/server/lookups-actions';
import { Lookup } from '@/app/model/lookups-model';
import { CustomerData } from '@/app/model/customers-model';
import { StoreData } from '@/app/model/stores-model';
import {
  CreateProductSellingPrices,
  GetProductSellingPricesByOwnId,
} from '@/app/action/server/product-selling-prices-actions';

export default function TabProductPriceContentTopCard({
  setRefresh,
  dialogId,
}: {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  dialogId: string;
}) {
  /*
  const p = useGlobalStore((state) => state.productSellingPrices);
  const [prices, setPrices] = useState(p);

  useEffect(() => {
    const unsubscribe = useGlobalStore.subscribe((state) => {
      setPrices(state.productSellingPrices);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);
  */

  const [prices, setPrices] = useState<ProductSellingPricesData>();

  const [orderTypes, setOrderTypes] = useState<Lookup[]>([]);

  const [customers, setCustomers] = useState<CustomerData[]>([]);
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
    const res1 = await GetLookupsOrderTypes();
    setOrderTypes(res1.data);
    const res2 = await GetLookupCustomers('', '1', '99999');
    setCustomers(res2.data);
    const res3 = await GetLookupStores('', '1', '99999');
    setStores(res3.data);
    const res4 = await GetProductSellingPricesByOwnId(dialogId);
    setPrices(res4);
  }, []); // ✅ No dependencies

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  console.log('prices data ...', prices);

  if (loading) {
    return <div>Loading...</div>;
  }

  async function onSubmit(data: ProductSellingPricesData) {
    //delete data._id;
    //const productCreated = await CreateProduct(data);
    console.log('Submitting...');
    /*
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
    */

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

    //revalidateAndRedirectUrl('/dashboard/products');
  }

  /*
  const [prices, setPrices] = useState<
    ProductSellingPricesData | null | undefined
  >(p);

  useEffect(() => {
    setPrices((prev) => {
      if (prev && p && JSON.stringify(prev) === JSON.stringify(p)) {
        return prev; // No update needed
      }
      return p; // Only update if different
    });
  }, [p]);
  */

  /*
  if (!prices) {
    return <div>Loading...</div>;
  }
  */

  const defaultValues: ProductSellingPricesData = {
    _id: dialogId ?? undefined,
    productId: prices?.productId,
    orderType: prices?.orderType || '',
    storeName: prices?.storeName || '',
    customerName: prices?.customerName || '',
    sellingPrice: 0.0,
  };

  const form = useForm<ProductSellingPricesData>({
    resolver: zodResolver(ZodSchemaProductSellingPrices),
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

  /*
  useEffect(() => {
    if (p) setPrices(p);
  }, [p]);
*/

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product Price </CardTitle>
            <CardDescription>{`Manage product price for ${dialogId}.`}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Type</TableHead>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead className="md:table-cell">Selling Price</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name="orderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue=""
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select order type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {orderTypes.map((l) => (
                                <SelectItem
                                  key={l.lookupValue}
                                  value={l.lookupValue}
                                >
                                  {l.lookupDescription}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody></TableBody>
            </Table>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </form>
    </Form>
  );
}
