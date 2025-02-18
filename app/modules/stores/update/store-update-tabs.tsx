'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator"


export default function ProductUpdateTabs() {
    return (
        <Tabs defaultValue="prices">
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="prices">Prices</TabsTrigger>
                            <TabsTrigger value="attributes">Attributes</TabsTrigger>
                            <TabsTrigger value="sales">Sales</TabsTrigger>

                        </TabsList>


                    </div>
                    <TabsContent value="prices">

                        Prices 
                        <Separator className="my-4" />
                        <div className="relative">

                            

                        </div>
                    </TabsContent>
                </Tabs>


    )
}