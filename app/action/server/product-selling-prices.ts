'use server'
//import { apiClientDq } from "@/lib/fetch-helper";
//import { FileUploadResponse } from "@/app/model/file-uploads-model";
//import { FileUploadData } from "@/app/model/file-uploads-model";
//import { ApiOperationNames } from "@/app/model/api-model";

import { auth } from "@/auth";

import { ProductSellingPricesData } from "@/app/model/products-model";

const base = process.env.APP_API_SERVER_DQ_URL || "http://172.104.117.139:3000/v1/dq"

import { apiComplexDq } from "@/lib/fetch-helper";

export async function GetProductSellingPricesById(id: string) {

    const entity = 'product';
    const operation = ApiOperationNames.FindAll;
    const method = 'POST';
    const queryName = 'getProductSellingPrices'

    const result = await apiComplexDq<ProductSellingPricesData, ProductSellingPricesData>(entity, queryName, operation, id, 
        { method: method});

    return result;
}

import { ApiOperationNames } from "@/app/model/api-model";

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions<T = unknown> {
  method?: FetchMethod;
  body?: T;
  headers?: HeadersInit;
  token?: string;
  timeout?: number; // Timeout in milliseconds
}


