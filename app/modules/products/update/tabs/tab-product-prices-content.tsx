
import { TabsContent } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator"

//import { ProductSellingPricesData } from '@/app/model/products-model';

//import { GetProductSellingPricesById } from '@/app/action/server/product-selling-prices';
//import ProductPricesContentTableRow from './tab-product-prices-content-table-row';
import TabProductPricesContentTableSimple from './tab-product-prices-content-table-simple';
import { IProductPrices } from '@/app/model/products-model';

import { apiComplexDq } from '@/lib/fetch-helper';

import { ApiOperationNames } from '@/app/model/api-model';

export function TabProductPricesContent( {productPrices} : {productPrices: IProductPrices[]} ) {




    return (
        <TabsContent value="prices" className="px-10">
                        
            <Separator className="my-4" /> 
            <TabProductPricesContentTableSimple data={productPrices} limit={100} page={1} totalDataCount={100}/>      
        </TabsContent>
    )
}