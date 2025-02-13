'use server'
import { apiClientDq } from "@/lib/fetch-helper";

import { NewProductData } from "@/app/model/products-model";
import { ApiOperationNames } from "@/app/model/api-model";
 
export async function DeleteProductService(data: NewProductData) {

    const entity = 'product';
    const operation = ApiOperationNames.Create;
    const id = "";
    const method = 'POST';

    const result = await apiClientDq<NewProductData, NewProductData>(entity, operation, id, 
        { method: method,
        body: data,});

    return result;
}