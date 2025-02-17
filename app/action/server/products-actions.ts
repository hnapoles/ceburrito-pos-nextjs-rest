'use server'

import { apiClientDq } from "@/lib/fetch-helper";

import { ProductData } from "@/app/model/products-model";
import { ApiOperationNames } from "@/app/model/api-model";
 

export async function DeleteProductById(id: string) {

    const entity = 'product';
    const operation = ApiOperationNames.Delete;
    const method = 'POST';

    const result = await apiClientDq<ProductData, ProductData>(entity, operation, id, 
        { method: method});

    return result;
}


export async function CreateProduct(data: ProductData) {

    const entity = 'product';
    const operation = ApiOperationNames.Create;
    const id = "";
    const method = 'POST';

    const result = await apiClientDq<ProductData,ProductData>(entity, operation, id, 
        { method: method,
        body: data,});

    return result;
}

export async function UpdateProduct(data: ProductData) {

    const entity = 'product';
    const operation = ApiOperationNames.Update;
    const id = data._id;
    const method = 'POST';

    const result = await apiClientDq<ProductData, ProductData>(entity, operation, id, 
        { method: method,
        body: data,});

    return result;
}