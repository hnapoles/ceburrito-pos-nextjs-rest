'use client';

import {
  Tabs,
  //TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
//import { Separator } from "@/components/ui/separator"

import { WhoTabContent } from '@/app/nav/who-tab-content';
import { IUserWho } from '@/app/models/users-model';

import { TabProductPricesContent } from './tabs/tab-product-prices-content';

import { useGlobalStore } from '@/app/providers/zustand-provider';

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
