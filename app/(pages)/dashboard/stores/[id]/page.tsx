import ProductUpdate from "@/app/modules/products/update/product-update";

import { apiClientDq } from "@/lib/fetch-helper";

import { LookupQueryResults } from "@/app/model/lookups-model";
import { StoreData } from "@/app/model/stores-model";
import { FindAll, ApiOperationNames, FindOne } from "@/app/model/api-model";


export default async function StoreUpdatePage({ params }: {
  params: Promise<{ id: string }>
} ) {


    const method = 'POST';
    const id = (await params).id;
    const entity = 'store';

    const store =  await apiClientDq<StoreData, FindOne>(entity, ApiOperationNames.FindOne, id, 
      { method: method});


    return (
        <div>
            {JSON.stringify(store)}
        </div>
    )
    /*
    return (
      <ProductUpdate product={product} types={types} categories={categories} />
    )
      */

}