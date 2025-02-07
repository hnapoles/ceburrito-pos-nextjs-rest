'use server';
import { revalidatePath } from 'next/cache';

import { apiClientDq } from "@/lib/fetch-helper"

import { FindOneForDeleteProps, ApiOperationNames } from "../model/api-model";
import { IProduct } from "../model/products-model";

export async function deleteProductById(id: string) {

    const apiProps : FindOneForDeleteProps = {
          entity: 'product',
          operation: ApiOperationNames.FindOneForDelete,
          id: id,
    }
    
    console.log('deleting id ', id)
    try {
          const results = await apiClientDq<IProduct, FindOneForDeleteProps>(ApiOperationNames.FindOneForDelete, 
              { method: 'POST',
                body: apiProps,
              })
           console.log(results)
           console.log('deleted')
    } catch(error) {
          console.log('error calling api ', error)
          throw new Error("'error calling api")
    }

}