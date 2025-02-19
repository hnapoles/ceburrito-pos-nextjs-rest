
import { TabsContent } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator"

import TabProductPricesContentTableSimple from './tab-product-prices-content-table-simple';
import { IProductPrices } from '@/app/model/products-model';

export function TabProductPricesContent( {productPrices} : {productPrices: IProductPrices[]} ) {

    return (
        <TabsContent value="prices" className="px-0">
                        
            <Separator className="my-4" /> 
            <TabProductPricesContentTableSimple data={productPrices} limit={100} page={1} totalDataCount={100}/>      
        </TabsContent>
    )
    
}