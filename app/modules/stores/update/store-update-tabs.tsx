'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator"

import { StoreData } from '@/app/model/stores-model';


export default function ProductUpdateTabs({ store }: { store: StoreData }) {
    return (
        <Tabs defaultValue="who">
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="who">Who</TabsTrigger>
                            <TabsTrigger value="attributes">Attributes</TabsTrigger>
                            <TabsTrigger value="sales">Sales</TabsTrigger>

                        </TabsList>


                    </div>
                    <TabsContent value="who" className="px-10">

                         Row Who?
                        <Separator className="my-4" />
                        <div className="relative space-between-10">
                            <div>
                                Created by: {store?.createdBy}
                            </div>
                            <div>
                                Created At: {store.createdAt?.toLocaleString('en-US', { timeZone: 'America/Chicago' })}
                            </div>
                            <div>
                                Updated by: {store?.updatedBy}
                            </div>
                            <div>
                                Updated At: {store.updatedAt?.toLocaleString('en-US', { timeZone: 'America/Chicago' })}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>


    )
}