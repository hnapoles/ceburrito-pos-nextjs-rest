'use client';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Lookup } from '@/app/models/lookups-model';
import { ProductBase } from '@/app/models/products-model';
import {
  Card,
  CardContent,
  CardFooter,
  //CardHeader,
  //CardTitle,
} from '@/components/ui/card-rounded-sm';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button-rounded-sm';

import { useStore } from '@/app/providers/zustand-provider';
//import OrdersIdAddItemsViewGrid from './addItems/zorders-id-addItems-view-grid';
import { OrderBase, OrderLineBase } from '@/app/models/orders-model';
import OrdersByIdOrderDetails from './orders-id-additems-orderdetails';
import OrdersProductCard from '../base/orders-product-card';
import { UpdateOrder } from '@/app/actions/server/orders-actions';
import { toast } from '@/hooks/use-toast';
import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import KeyboardTouchProductSearch from '../../keyboard/keyboard-touch-product-search';

interface ordersByIdAddItemsProps {
  products: ProductBase[];
  categories: Lookup[];
  orderData: OrderBase;
  searchTags?: string[];
}

export default function OrdersByIdAddItems({
  products,
  categories,
  orderData,
  searchTags,
}: ordersByIdAddItemsProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(
    categories[0].lookupValue || 'all',
  );
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 24; // Define rows per page

  const [order, setOrder] = useState(orderData);

  //
  const { storeName } = useStore();

  const [isSearchTouchDialogOpen, setIsSearchTouchDialogOpen] = useState(false);

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

  //use callBack instead
  const handleAddOrUpdateOrderLine = async (newOrderLine: OrderLineBase) => {
    const orderLines = order.orderLines || [];
    let updatedOrder: OrderBase;

    const existingIndex =
      orderLines.findIndex(
        (orderLine) =>
          orderLine.productName === newOrderLine.productName &&
          (orderLine.sizeOption ?? '') === (newOrderLine.sizeOption ?? '') &&
          (orderLine.spiceOption ?? '') === (newOrderLine.spiceOption ?? '') &&
          orderLine.status === 'open',
      ) || 0;

    if (existingIndex !== -1) {
      const updatedOrderLines = [...orderLines];
      const existingOrder = updatedOrderLines[existingIndex];

      updatedOrderLines[existingIndex] = {
        ...existingOrder,
        quantity: existingOrder.quantity + newOrderLine.quantity,
        amount:
          existingOrder.amount +
          existingOrder.unitPrice * newOrderLine.quantity,
      };

      updatedOrder = {
        ...order,
        totalAmount: (order.totalAmount || 0) + newOrderLine.amount,
        orderLines: updatedOrderLines,
      };
    } else {
      updatedOrder = {
        ...order,
        totalAmount: (order.totalAmount || 0) + newOrderLine.amount,
        orderLines: [...orderLines, newOrderLine],
      };
    }

    const updatedData = await UpdateOrder(updatedOrder);

    toast({
      title: 'Update success',
      description: <span>{newOrderLine.productName}, added to order</span>,
    });
    ///revalidateAndRedirectUrl(`/orders/${order._id}/addItems`);
    setOrder(updatedData);
  };
  // end handleAddOrUpdateOrderLine()

  const itemsCount = (order.orderLines || [])
    .filter((line) => (line.status ?? 'open') !== 'canceled') // Default status to "open"
    .reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="grid gap-0 grid-cols-1 md:grid-cols-3 grid-auto-rows-fr">
      {/* Right Side - cart */}
      <div className="col-span-1 h-full">
        <OrdersByIdOrderDetails order={order} setOrder={setOrder} />
      </div>
      {/* Left Side - add items */}
      <div className="md:col-span-2 col-span-1 h-full">
        <Card className="h-full flex flex-col">
          {/*<CardHeader>
            <CardTitle>Select Items</CardTitle>
          </CardHeader>*/}
          <CardContent>
            <Tabs
              defaultValue={category}
              value={category}
              onValueChange={setCategory}
              className="w-full"
            >
              <div className="flex items-center gap-2 w-full mt-1">
                {/* Scrollable Tabs Wrapper */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="w-full overflow-x-auto sm:overflow-x-auto md:overflow-x-auto">
                    <TabsList className="flex w-max space-x-2">
                      <TabsTrigger value="all">All</TabsTrigger>
                      {categories.map((item) => (
                        <TabsTrigger key={item._id} value={item.lookupValue}>
                          {item.lookupDescription}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="h-10 gap-1"
                  onClick={() => setSearch('')}
                >
                  <CircleX className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Clear
                  </span>
                </Button>
                {/* Search Input (No Overlapping) */}
                <div className="w-32 lg:w-40 flex-shrink-0">
                  <Input
                    placeholder="Quick Search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1); // Reset to first page on search change
                    }}
                    className="h-10"
                    onClick={() => setIsSearchTouchDialogOpen(true)}
                  />
                </div>
              </div>

              <TabsContent value={category}>
                {!storeName ? (
                  <div className="flex justify-center items-center h-20">
                    <span className="text-gray-500">Loading store...</span>
                  </div>
                ) : (
                  <OrdersProductCard
                    products={paginatedProducts}
                    storeName={storeName}
                    onSubmit={handleAddOrUpdateOrderLine}
                    order={order}
                    itemsCount={itemsCount}
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
      {/* Floater - Order Summary */}
      <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-2 shadow-md border-t flex items-center justify-between gap-x-4">
        <div className="flex items-center space-x-6 overflow-hidden ml-12">
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">
              Items (
              <span className="text-purple-700 whitespace-nowrap">
                {itemsCount}
              </span>
              ):
            </span>
            <span className="text-purple-700 whitespace-nowrap">
              {formatPesoNoDecimals(Math.floor(order.totalAmount || 0))}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">Order Type:</span>
            <span className="text-purple-700 whitespace-nowrap">
              {order.type?.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">Id:</span>
            <span className="text-purple-700 whitespace-nowrap">
              ... {order._id?.slice(-4).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push(`/orders/${order._id}/edit`)}
          className="whitespace-nowrap"
        >
          Edit Order Information
        </Button>
      </div>
      <KeyboardTouchProductSearch
        currentValue={search}
        setTouchValue={setSearch}
        setIsTouchDialogOpen={setIsSearchTouchDialogOpen}
        isTouchDialogOpen={isSearchTouchDialogOpen}
        searchTags={searchTags || []}
      />
    </div>
  );
}
