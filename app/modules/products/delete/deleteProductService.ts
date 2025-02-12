'use server'
import { apiClientDq } from "@/lib/fetch-helper";

import { ProductData } from "@/app/model/products-model";
import { ApiOperationNames } from "@/app/model/api-model";
 
export async function DeleteProductByIdService(id: string) {

    const entity = 'product';
    const operation = ApiOperationNames.Delete;
    const method = 'POST';

    const result = await apiClientDq<ProductData, ProductData>(entity, operation, id, 
        { method: method});

    return result;
}