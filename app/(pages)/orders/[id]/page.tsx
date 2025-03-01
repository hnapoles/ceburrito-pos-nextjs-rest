import { GetOrderById } from '@/app/actions/server/orders-actions';
import {
  GetLookupCustomers,
  GetLookups,
  GetLookupStores,
} from '@/app/actions/server/lookups-actions';
import NotFoundGlobal from '@/app/nav/not-found-global';
import {
  DefaultSizeOptions,
  DefaultSpiceOptions,
} from '@/app/models/lookups-model';

//import OrdersByIdEdit from '@/app/features/orders/id/orders-id-edit';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { WhoTabContent } from '@/app/nav/who-tab-content';
import { UserWhoProps } from '@/app/models/users-model';

//import OrdersByIdPricesTableSimple from '@/app/features/orders/id/orders-id-prices-table-simple';

//start of function
export default async function OrdersByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const order = await GetOrderById(id);
  const lookups = await GetLookups('order', null);

  const statusesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'status',
  );

  const orderTypesLookup = lookups.data.filter(
    (item) => item.lookupCode === 'type',
  );

  if (!order) {
    return (
      <NotFoundGlobal display={'Order data not found'} backUrl={'/order'} />
    );
  }

  const customers = await GetLookupCustomers();

  //if-testing - set to true
  if (true)
    return (
      <>
        <div>Testing...</div>
        <pre>order data: {JSON.stringify(order, null, 2)}</pre>
        <pre>statuses: {JSON.stringify(statusesLookup, null, 2)}</pre>
        <pre>customersLookup: {JSON.stringify(customers, null, 2)}</pre>
        <pre>orderTypesLookup: {JSON.stringify(orderTypesLookup, null, 2)}</pre>
      </>
    );

  const who: UserWhoProps = {
    createdBy: order?.createdBy,
    createdAt: order?.createdAt ? new Date(order.createdAt) : undefined,
    updatedBy: order?.updatedBy,
    updatedAt: order?.updatedAt ? new Date(order.updatedAt) : undefined,
  };

  return (
    //grid cols=2 normal, cols1 for small
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Order Image and Details */}
      <div>
        <OrdersByIdEdit
          order={order}
          categoryLookup={categoriesLookup}
          statusLookup={statusesLookup}
          sizeLookup={sizeOptionsLookup}
          spiceLookup={spiceOptionsLookup}
        />
      </div>
      {/* Right Side - Order Tabs */}
      <div>
        <Tabs defaultValue="prices">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="who">Who</TabsTrigger>
              <TabsTrigger value="prices">Prices</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="who" className="px-0">
            <WhoTabContent who={who} />
          </TabsContent>
          <TabsContent value="prices" className="px-0">
            {/* Prices Content */}
            <OrdersByIdPricesTableSimple
              orderName={order.name}
              orderId={order._id || ''}
              data={orderPrices.data}
              limit={100}
              page={1}
              totalDataCount={orderPrices.count}
            />
          </TabsContent>
          <TabsContent value="attributes" className="px-0">
            [future] : attributes here...
          </TabsContent>
          <TabsContent value="sales" className="px-0">
            [future] : sales here...
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
