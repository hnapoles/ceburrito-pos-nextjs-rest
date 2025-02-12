'use server'

import { apiClientDq } from "@/lib/fetch-helper";

import { LookupQueryResults } from "@/app/model/lookups-model";
import { ProductCategoryFilter } from "@/app/model/products-model";
import { FindAll, ApiOperationNames } from "@/app/model/api-model";
import { any } from "zod";

export async function getProductCategories() {
     try {
        const results = await apiClientDq<LookupQueryResults, FindAll>('lookup', ApiOperationNames.FindAll, "", 
            { method: 'POST',
            body: ProductCategoryFilter,});
        console.log(results)
        return {results, null:any}
                    
    } catch (error) {
        console.log(error)
        return {null:any, error}
     }
}


