'use server';

import {
  IGetProductSellingPricesResults,
  ProductSellingPricesData,
} from '@/app/models/products-model';

import { apiClientDq } from '@/lib/fetch-helper';

import { FindAll, FindOne } from '@/app/models/api-model';

//const base =
//  process.env.APP_API_SERVER_DQ_URL || 'http://172.104.117.139:3000/v1/dq';

//import { apiComplexDq } from '@/lib/fetch-helper';

export async function GetProductSellingPricesByProductId(id: string) {
  const ProductSellingPricesFilter = {
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

  const result = await apiClientDq<IGetProductSellingPricesResults, FindAll>(
    entity,
    operation,
    id,
    { method: method, body: ProductSellingPricesFilter },
  );

  return result;
}

/*
const product = await apiClientDq<ProductData, FindOne>(
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

  const result = await apiClientDq<ProductSellingPricesData, FindOne>(
    entity,
    ApiOperationNames.FindOne,
    id,
    { method: method },
  );

  return result;
}

import { ApiOperationNames } from '@/app/models/api-model';
import { FindCustomerOutput } from '@/app/models/customers-model';

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions<T = unknown> {
  method?: FetchMethod;
  body?: T;
  headers?: HeadersInit;
  token?: string;
  timeout?: number; // Timeout in milliseconds
}

export async function CreateProductSellingPrices(
  data: ProductSellingPricesData,
) {
  const entity = 'product_selling_price';
  const operation = ApiOperationNames.Create;
  const id = '';
  const method = 'POST';

  const result = await apiClientDq<
    ProductSellingPricesData,
    ProductSellingPricesData
  >(entity, operation, id, { method: method, body: data });

  return result;
}
