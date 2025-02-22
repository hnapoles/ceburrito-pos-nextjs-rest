'use server';

import {
  FindProductSellingPricesOutput,
  ProductSellingPriceDataBase,
} from '@/app/models/products-model';

import { apiClientDq } from '@/lib/fetch-helper';

import { FindAllProps, FindOneProps } from '@/app/models/api-model';

//const base =
//  process.env.APP_API_SERVER_DQ_URL || 'http://172.104.117.139:3000/v1/dq';

//import { apiComplexDq } from '@/lib/fetch-helper';

export async function GetProductSellingPricesByProductId(id: string) {
  const productSellingPricesProps = {
    andFilter: {
      productId: id,
    },
    limit: 999,
    page: 1,
    sortOptions: [
      {
        sortField: 'orderType',
        sortOrder: 1,
      },
      {
        sortField: 'storeName',
        sortOrder: 1,
      },
      {
        sortField: 'customerName',
        sortOrder: 1,
      },
    ],
  };

  const entity = 'product_selling_price';
  const operation = ApiOperationNames.FindAll;
  const method = 'POST';

  const result = await apiClientDq<
    FindProductSellingPricesOutput,
    FindAllProps
  >(entity, operation, id, { method: method, body: productSellingPricesProps });

  return result;
}

/*
const product = await apiClientDq<ProductDataBase, FindOne>(
    'product',
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );
*/
export async function GetProductSellingPricesByOwnId(id: string) {
  const entity = 'product_selling_price';
  const operation = ApiOperationNames.FindOne;
  const method = 'POST';

  console.log('id in api call ', id);

  const result = await apiClientDq<ProductSellingPriceDataBase, FindOneProps>(
    entity,
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );

  return result;
}

import { ApiOperationNames } from '@/app/models/api-model';
import { FindCustomersOutput } from '@/app/models/customers-model';

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions<T = unknown> {
  method?: FetchMethod;
  body?: T;
  headers?: HeadersInit;
  token?: string;
  timeout?: number; // Timeout in milliseconds
}

export async function CreateProductSellingPrices(
  data: ProductSellingPriceDataBase,
) {
  const entity = 'product_selling_price';
  const operation = ApiOperationNames.Create;
  const id = '';
  const method = 'POST';

  const result = await apiClientDq<
    ProductSellingPriceDataBase,
    ProductSellingPriceDataBase
  >(entity, operation, id, { method: method, body: data });

  return result;
}
