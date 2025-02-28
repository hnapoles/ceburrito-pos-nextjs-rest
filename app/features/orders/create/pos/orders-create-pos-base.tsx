'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Lookup } from '@/app/models/lookups-model';
import { ProductBase } from '@/app/models/products-model';
import {
  Card,
  CardContent,
  CardFooter,
  //CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrdersCreatePosSearchInput } from './orders-create-pos-search-input';
import OrdersCreatePosViewGrid from './orders-create-pos-view-grid';

interface ordersCreatePosProps {
  products: ProductBase[];
  categories: Lookup[];
  currentTab: string;
}

export default function OrdersCreatePosBase({
  products,
  categories,
  currentTab,
}: ordersCreatePosProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    //grid cols=2 normal, cols1 for small
    <div
      className="grid gap-1
       sm:grid-cols-1 lg:grid-cols-3 md:gids-cols-3"
    >
      {/* Left Side - add items */}
      <div className="md:col-span-2 col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={currentTab}
              value={currentTab}
              onValueChange={handleTabChange}
            >
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.map((item) => (
                    <TabsTrigger key={item._id} value={item.lookupValue}>
                      {item.lookupDescription}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <OrdersCreatePosSearchInput />
                </div>
              </div>
              <TabsContent value={currentTab}>
                <OrdersCreatePosViewGrid products={products} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
      {/* Right Side - cart */}
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Cart</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
}
