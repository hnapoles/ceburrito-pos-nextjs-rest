import { apiClientDq } from "@/lib/fetch-helper"

import { IProductResponse } from "@/app/model/products-model"
import { ApiOperationNames, FindAllByKeywordWithPageLimitProps } from "@/app/model/api-model"

export default async function Page() {
        
    let products : IProductResponse[] = []
  
    let apiProps : FindAllByKeywordWithPageLimitProps = {
      entity: 'product',
      operation: ApiOperationNames.FindAllByKeywordWithPageLimit
    }
    
    try {
      const results = await apiClientDq<IProductResponse[], {}>(ApiOperationNames.FindAllByKeywordWithPageLimit, 
          { method: 'POST',
            body: apiProps,
          });
      products = results
    } catch(error) {
      console.log('error calling api ', error)
    }

    if (products) {      
      return (
        <div className="flex h-screen w-full items-center justify-center px-4">
          Products
          {JSON.stringify(products)}
        </div>
      )
    }
    

    
} 