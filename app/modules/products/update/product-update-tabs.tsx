'use client';

import {
  Tabs,
  //TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
//import { Separator } from "@/components/ui/separator"

import { ProductData } from '@/app/model/products-model';

import { WhoTabContent } from '@/app/nav/who-tab-content';
import { IUserWho } from '@/app/model/users-model';

import { TabProductPricesContent } from './tabs/tab-product-prices-content';

import { IProductPrices } from '@/app/model/products-model';

import { useGlobalStore } from '@/app/provider/zustand-provider';

export default function ProductUpdateTabs() {
  const product = useGlobalStore((state) => state.product);

  const who: IUserWho = {
    createdBy: product?.createdBy,
    createdAt: product?.createdAt,
    updatedBy: product?.updatedBy,
    updatedAt: product?.updatedAt,
  };

  return (
    <Tabs defaultValue="who">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="who">Who</TabsTrigger>
          <TabsTrigger value="prices">Prices</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
      </div>
      <WhoTabContent who={who} />
      <TabProductPricesContent />
    </Tabs>
  );
}
