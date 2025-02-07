import { apiClientDq } from "@/lib/fetch-helper"

import { IProduct } from "@/app/model/products-model"
import { ApiOperationNames, FindAllByKeywordWithPageLimitProps } from "@/app/model/api-model"

import ProductsMainPage from "@/app/modules/products/products-main-page";

export default async function Page(
  props: {
    searchParams: Promise<{ keyword: string, page: number, limit: number }>;
}) {

    const searchParams = await props.searchParams;
    const keyword = searchParams.keyword ?? ''
    const limit = searchParams.limit ?? '10'
    const page = searchParams.page ?? '1'
          
    let products : IProduct[] = []
  
    const apiProps : FindAllByKeywordWithPageLimitProps = {
      entity: 'product',
      operation: ApiOperationNames.FindAllByKeywordWithPageLimit,
      keyword: keyword,
      page: page.toString(),
      limit: limit.toString(),
    }
    
    try {
      const results = await apiClientDq<IProduct[], FindAllByKeywordWithPageLimitProps>(ApiOperationNames.FindAllByKeywordWithPageLimit, 
          { method: 'POST',
            body: apiProps,
          });
      products = results
    } catch(error) {
      console.log('error calling api ', error)
    }

    const totalProducts = 10;

    if (products) {      
      return (
        <ProductsMainPage products={products} limit={limit} page={page} totalDataCount={totalProducts} />
      )
    }
    

    
} 