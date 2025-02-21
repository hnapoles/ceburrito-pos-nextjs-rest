'use server';

import { ProductSellingPricesData } from '@/app/model/products-model';

import { apiClientDq } from '@/lib/fetch-helper';

//const base =
//  process.env.APP_API_SERVER_DQ_URL || 'http://172.104.117.139:3000/v1/dq';

import { apiComplexDq } from '@/lib/fetch-helper';

export async function GetProductSellingPricesById(id: string) {
  const entity = 'product';
  const operation = ApiOperationNames.FindAll;
  const method = 'POST';
  const queryName = 'getProductSellingPrices';

  const result = await apiComplexDq<
    ProductSellingPricesData,
    ProductSellingPricesData
  >(entity, queryName, operation, id, { method: method });

  return result;
}

import { ApiOperationNames } from '@/app/model/api-model';

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
