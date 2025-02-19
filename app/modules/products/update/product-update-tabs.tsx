'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator"

import { ProductData } from '@/app/model/products-model';

import { WhoTabContent } from '@/app/nav/who-tab-content';
import { IUserWho } from '@/app/model/users-model';


export default function ProductUpdateTabs({ product }: { product: ProductData }) {

    const who : IUserWho = {
        createdBy  : product?.createdBy,
        createdAt  : product?.createdAt,
        updatedBy  : product?.updatedBy,
        updatedAt  : product?.updatedAt,
    }

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
                </Tabs>


    )
}