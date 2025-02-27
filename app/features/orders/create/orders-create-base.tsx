'use client';

//import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { File, PlusCircle } from 'lucide-react';

//import { ProductSearchInput } from './order-search-input.';
//import ProductsTableSimple from './orders-table-simple';

import { OrderBase } from '@/app/models/orders-model';
import { Lookup } from '@/app/models/lookups-model';

import { OrdersSearchInput } from './orders-list-search-input';
import OrderListViewSwitcher from './orders-list-view-switcher';
import OrdersListViewGrid from './orders-list-view-grid';

interface orderListProps {
  orders: OrderBase[];
  limit: number | 10;
  page: number | 1;
  totalDataCount: number | 1;
  statusesLookup: Lookup[];
  currentTab: string;
}

const OrdersListBase: React.FC<orderListProps> = ({
  orders,
  limit,
  page,
  totalDataCount,
  statusesLookup,
  currentTab,
}) => {
  const pathname = usePathname();
  const createLink = `${pathname}/create`;

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('status', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs
      defaultValue={currentTab}
      value={currentTab}
      onValueChange={handleTabChange}
    >
      <div className="flex items-center">
        <TabsList>
          {statusesLookup.map((item) => (
            <TabsTrigger key={item._id} value={item.lookupValue}>
              {item.lookupDescription}
            </TabsTrigger>
          ))}
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <OrderListViewSwitcher />
          <OrdersSearchInput />
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>

          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => (window.location.href = createLink)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Order
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value={currentTab}>
        {/*
        <ProductsTableSimple
          data={orders}
          limit={Number(limit)}
          page={Number(page)}
          totalDataCount={totalDataCount}
        />*/}
        <OrdersListViewGrid orders={orders} />
      </TabsContent>
    </Tabs>
  );
};

export default OrdersListBase;
