'use client';

import {
  Tabs,
  //TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { StoreBase } from '@/app/models/stores-model';

import { WhoTabContent } from '@/app/nav/who-tab-content';
import { UserWhoProps } from '@/app/models/users-model';

export default function ProductUpdateTabs({ store }: { store: StoreBase }) {
  const who: UserWhoProps = {
    createdBy: store?.createdBy,
    createdAt: store?.createdAt,
    updatedBy: store?.updatedBy,
    updatedAt: store?.updatedAt,
  };
  return (
    <Tabs defaultValue="who">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="who">Who</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
      </div>
      <WhoTabContent who={who} />
    </Tabs>
  );
}
