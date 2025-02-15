'use server'
import { apiClientDq } from "@/lib/fetch-helper";

import { ProductData } from "@/app/model/products-model";
import { ApiOperationNames } from "@/app/model/api-model";
 
export async function UpdateProductService(data: ProductData) {

    const entity = 'product';
    const operation = ApiOperationNames.Update;
    const id = data._id;
    const method = 'POST';

    const result = await apiClientDq<ProductData, ProductData>(entity, operation, id, 
        { method: method,
        body: data,});

    return result;
}