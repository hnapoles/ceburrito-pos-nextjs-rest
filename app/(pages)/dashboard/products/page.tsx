import { apiClientDq } from "@/lib/fetch-helper"

import { IProduct, IGetProductsResults } from "@/app/model/products-model"
import { ApiOperationNames, FindAll } from "@/app/model/api-model"

import ProductsMainPage from "@/app/modules/products/list/products-main-page";
import NotFound from "./not-found";

export default async function Page(
  props: {
    searchParams: Promise<{ keyword: string, page: string, limit: string }>;
}) {

    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword ?? null
    const limit = searchParams.limit ?? '10'
    const page = searchParams.page ?? '1'
          
    let products : IProduct[] = []
    let totalProducts = 0;
  
    const apiProps : FindAll = {
      entity: 'product',
      keyword: keyword,
      searchKeywordFields: ["name", "description"],
      page: parseInt(page),
      limit: parseInt(limit),
    }

    try {
      
      const results = await apiClientDq<IGetProductsResults, FindAll>('product', ApiOperationNames.FindAll, "", 
          { method: 'POST',
            body: apiProps,
          });
      totalProducts = results.count
      products = results.data
    } catch(error) {
      console.log('error calling api ', error)
    }
  
    if (products) {      
      return (
        <ProductsMainPage products={products} limit={parseInt(limit)} page={parseInt(page)} totalDataCount={totalProducts} />
      )
    }
     
    if (!products) {
      return (
        <NotFound/>
      )
    }


    
} 