import ProductUpdate from "@/app/modules/products/update/product-update";

import { apiClientDq } from "@/lib/fetch-helper";

import { LookupQueryResults } from "@/app/model/lookups-model";
import { ProductCategoryFilter, ProductTypeFilter, ProductData } from "@/app/model/products-model";
import { FindAll, ApiOperationNames, FindOne } from "@/app/model/api-model";

import { IProductPrices } from "@/app/model/products-model";
import { apiComplexDq } from "@/lib/fetch-helper";

export default async function ProductEditPage({ params }: {
  params: Promise<{ id: string }>
} ) {


    const method = 'POST';
    const id = (await params).id;

    const product =  await apiClientDq<ProductData, FindOne>('product', ApiOperationNames.FindOne, id, 
      { method: method});

    const lookup1 = await apiClientDq<LookupQueryResults, FindAll>('lookup', ApiOperationNames.FindAll, "", 
        { method: 'POST',
        body: ProductTypeFilter,});

    const types = lookup1.data;

    const lookup2 = await apiClientDq<LookupQueryResults, FindAll>('lookup', ApiOperationNames.FindAll, "", 
        { method: 'POST',
        body: ProductCategoryFilter,});

    const categories = lookup2.data; 

       //const productPrices = GetProductSellingPricesById(productId);
   const entity = 'product';
   const operation = ApiOperationNames.FindAll;
   const queryName = 'getProductSellingPrices'


   const productPrices = await apiComplexDq<IProductPrices[], IProductPrices>(entity, queryName, operation, product._id, 
        { method: method});
        //console.log(productPrices)
 

    return (
      <ProductUpdate product={product} types={types} categories={categories} productPrices={productPrices} />
    )

}