'use client';
import { useState } from 'react';

import { Lookup } from '@/app/models/lookups-model';
import { ProductBase } from '@/app/models/products-model';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrdersIdLines from '../orders-id-lines';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button-rounded-sm';

import { useStore } from '@/app/providers/zustand-provider';
import OrdersIdAddItemsViewGrid from './orders-id-addItems-view-grid';
import { OrderBase } from '@/app/models/orders-model';

interface ordersCreatePosProps {
  products: ProductBase[];
  categories: Lookup[];
  order: OrderBase;
}

export default function OrdersIdAddItemsBase({
  products,
  categories,
  order,
}: ordersCreatePosProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 24; // Define rows per page

  //
  const { storeName } = useStore();

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

  // Get paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalDataCount = filteredProducts.length; // Update total based on filtered results

  // Pagination handlers
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage * rowsPerPage < totalDataCount)
      setCurrentPage(currentPage + 1);
  };

  return (
    <div className="grid gap-1 sm:grid-cols-1 lg:grid-cols-4 md:grid-cols-4 grid-auto-rows-fr">
      {/* Left Side - add items */}
      <div className="md:col-span-3 col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={category}
              value={category}
              onValueChange={setCategory}
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
                    placeholder="Quick Search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1); // Reset to first page on search change
                    }}
                    className="mr-2 mb-4 h-8"
                  />
                </div>
              </div>
              <TabsContent value={category}>
                {!storeName ? (
                  <div className="flex justify-center items-center h-20">
                    <span className="text-gray-500">Loading store...</span>
                  </div>
                ) : (
                  <OrdersIdAddItemsViewGrid
                    products={paginatedProducts}
                    storeName={storeName}
                    order={order}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="flex items-center w-full justify-between">
              <div className="text-xs text-muted-foreground">
                Showing{' '}
                <strong>
                  {totalDataCount > 0 ? startIndex + 1 : 0}-
                  {Math.min(endIndex, totalDataCount)}
                </strong>{' '}
                of <strong>{totalDataCount}</strong> products
              </div>
              <div className="flex">
                <Button
                  onClick={prevPage}
                  variant="ghost"
                  size="sm"
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Prev
                </Button>
                <Button
                  onClick={nextPage}
                  variant="ghost"
                  size="sm"
                  disabled={currentPage * rowsPerPage >= totalDataCount}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* Right Side - cart */}
      <div className="col-span-1 h-full">
        <OrdersIdLines
          orderType={order.type || ''}
          onCheckout={false}
          orderLines={order.orderLines || []}
          totalAmount={order.totalAmount || 0}
          order={order}
        />
      </div>
    </div>
  );
}
