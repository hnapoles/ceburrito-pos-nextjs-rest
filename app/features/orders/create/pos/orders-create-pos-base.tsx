'use client';
import { useState } from 'react';
//import { useRouter, useSearchParams } from 'next/navigation';

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
//import { OrdersCreatePosSearchInput } from './orders-create-pos-search-input';
import OrdersCreatePosViewGrid from './orders-create-pos-view-grid';
import { Input } from '@/components/ui/input';

interface ordersCreatePosProps {
  products: ProductBase[];
  totalCount: number;
  categories: Lookup[];
  //currentTab: string; //local search instead of db for faster response
}

export default function OrdersCreatePosBase({
  products,
  totalCount,
  categories,
}: //currentTab,
ordersCreatePosProps) {
  //const router = useRouter();
  //const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    setCategory(value);
    /* this will be a local search (faster)
    const params = new URLSearchParams(searchParams);
    params.set('category', value);
    router.push(`?${params.toString()}`, { scroll: false });
    */
  };

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === 'all' || category === ''
        ? true
        : product.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = search
      ? Object.values(product)
          .filter((value) => typeof value === 'string')
          .some((value) =>
            (value as string).toLowerCase().includes(search.toLowerCase()),
          )
      : true;

    return matchesCategory && matchesSearch;
  });

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
              defaultValue={category}
              value={category}
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
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mr-2 mb-4 h-8"
                  />
                </div>
              </div>
              <TabsContent value={category}>
                <OrdersCreatePosViewGrid products={filteredProducts} />
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
