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
  CardTitle,
  //CardHeader,
  //CardTitle,
} from '@/components/ui/card-rounded-sm';

import { useMediaQuery } from 'react-responsive'; // Install if needed: npm install react-responsive
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button-rounded-sm';

import { useCartStore, useStoreName } from '@/app/providers/zustand-provider';
//import OrdersIdAddItemsViewGrid from './addItems/zorders-id-addItems-view-grid';
import { OrderBase, OrderLineBase } from '@/app/models/orders-model';

import OrdersProductCard from '../base/orders-product-card';
import { toast } from '@/hooks/use-toast';
import { formatPesoNoDecimals } from '@/app/actions/client/peso';
import KeyboardTouchProductSearch from '../../keyboard/keyboard-touch-product-search';

import OrdersCartDetails from '../base/orders-cart-details';

interface ordersByIdAddItemsProps {
  products: ProductBase[];
  categories: Lookup[];
  orderData?: OrderBase;
  searchTags?: string[];
  orderType: string;
}

export default function OrdersCreateByOrderType({
  products,
  categories,
  searchTags,
  orderType,
}: ordersByIdAddItemsProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(
    categories[0].lookupValue || 'all',
  );
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 24; // Define rows per page

  //const [order, setOrder] = useState(orderData);
  const totalAmount = useCartStore((state) => state.totalAmount());
  const totalItems = useCartStore((state) => state.totalItems());

  //
  const { storeName } = useStoreName();

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

  const addOrUpdateOrderLine = useCartStore(
    (state) => state.addOrUpdateOrderLine,
  );

  //use callBack instead
  async function handleAddToCart(selectedProduct: OrderLineBase) {
    if (selectedProduct) {
      addOrUpdateOrderLine({
        productId: selectedProduct.productId || '',
        productName: selectedProduct.productName,
        imageUrl: selectedProduct.imageUrl,
        sizeOption: selectedProduct.sizeOption,
        spiceOption: selectedProduct.spiceOption,
        quantity: selectedProduct.quantity,
        unitPrice: selectedProduct.unitPrice,
        amount: selectedProduct.amount,
        status: 'open',
      });

      toast({
        title: 'Update success',
        description: <span>{selectedProduct.productName}, added to cart</span>,
      });
    }
  }

  return (
    <div className="grid gap-0 grid-cols-1 md:grid-cols-3 grid-auto-rows-fr">
      {/* Right Side - cart */}
      <div className="col-span-1 h-full">
        <OrdersCartDetails orderType={orderType} />
      </div>
      {/* Left Side - add items */}
      <div className="md:col-span-2 col-span-1 h-full">
        <Card className="h-full flex flex-col">
          <CardTitle className="ml-5 mb-2 mt-4">Select Items</CardTitle>
          <CardContent>
            <Tabs
              defaultValue={category}
              value={category}
              onValueChange={setCategory}
              className="w-full"
            >
              <div className="flex items-center gap-2 w-full mt-1">
                {/* Responsive: Use Select on small screens, TabsList on larger screens */}
                <div className="flex-1 min-w-0">
                  {useMediaQuery({ maxWidth: 768 }) ? ( // Show Select only on small screens
                    <Select onValueChange={setCategory} value={category}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {categories.map((item) => (
                          <SelectItem key={item._id} value={item.lookupValue}>
                            {item.lookupDescription}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
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
                  )}
                </div>

                {/* Search Input & Clear Button */}
                <Button
                  variant="outline"
                  className="h-10 gap-1"
                  onClick={() => setSearch('')}
                >
                  <CircleX className="h-8 w-8" />
                  <span className="sr-only sm:whitespace-nowrap">Clear</span>
                </Button>
                <div className="w-24 xl:w-40 flex-shrink-0">
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
                    <span className="text-gray-500">Loading data...</span>
                  </div>
                ) : (
                  <OrdersProductCard
                    products={paginatedProducts}
                    storeName={storeName}
                    onSubmit={handleAddToCart}
                    itemsCount={totalItems}
                    totalAmount={totalAmount}
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
      <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-2 shadow-md border-t border-black-900 flex items-center justify-between gap-x-4">
        <div className="flex items-center space-x-6 overflow-hidden ml-12">
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">
              Items (
              <span className="text-purple-700 whitespace-nowrap">
                {totalItems}
              </span>
              ):
            </span>
            <span className="text-purple-700 whitespace-nowrap">
              {formatPesoNoDecimals(Math.floor(totalAmount))}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium whitespace-nowrap">Order Type:</span>
            <span className="text-purple-700 whitespace-nowrap">
              {orderType.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="default"
          size="lg"
          onClick={() => router.push(`/orders/checkout/${orderType}`)}
          className="whitespace-nowrap border border-purple-500"
          disabled={totalAmount <= 0 || totalItems <= 0}
        >
          Checkout
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
