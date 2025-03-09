'use client';

//import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button-rounded-sm';
import { File, PlusCircle } from 'lucide-react';

//import { ProductSearchInput } from './order-search-input.';
//import ProductsTableSimple from './orders-table-simple';

import { OrderBase } from '@/app/models/orders-model';
import { OrdersSearchInput } from './orders-list-search-input';
import OrderListViewSwitcher from './orders-list-view-switcher';
import OrdersListViewGrid from './orders-list-view-grid';
import { Lookup } from '@/app/models/lookups-model';

interface orderListProps {
  orders: OrderBase[];
  limit: number | 10;
  page: number | 1;
  totalDataCount: number;
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
    <div className="grid grid-cols-1">
      <Tabs
        defaultValue={currentTab}
        value={currentTab}
        onValueChange={handleTabChange}
      >
        {/* ✅ FLEXBOX FIX for Tabs & Actions: Aligns properly on ALL screens */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
          {/* ✅ Tabs List - Always aligned left */}
          <TabsList className="flex flex-wrap md:flex-nowrap">
            {statusesLookup.map((item) => (
              <TabsTrigger key={item._id} value={item.lookupValue}>
                {item.lookupDescription}
              </TabsTrigger>
            ))}
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          {/* ✅ Actions - Aligns right on md+ screens, moves below tabs on sm */}
          <div className="flex flex-wrap md:flex-nowrap gap-2 mt-2 md:mt-0 w-full md:w-auto">
            <OrderListViewSwitcher />
            <OrdersSearchInput />
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>

            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => (window.location.href = createLink)}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Order</span>
            </Button>
          </div>
        </div>

        {/* ✅ Orders List Content - Properly aligned on all screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          <TabsContent value={currentTab}>
            <OrdersListViewGrid
              orders={orders}
              limit={limit}
              page={page}
              totalDataCount={totalDataCount}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default OrdersListBase;
