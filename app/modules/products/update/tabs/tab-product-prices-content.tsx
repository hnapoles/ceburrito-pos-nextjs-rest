
import { TabsContent } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator"

import { ProductSellingPricesData } from '@/app/model/products-model';

export function TabProductPricesContent( {productId} : {productId: string | null} ) {
    return (
        <TabsContent value="prices" className="px-10">
                         productId : {productId}
                        <Separator className="my-4" />       
        </TabsContent>
    )
}