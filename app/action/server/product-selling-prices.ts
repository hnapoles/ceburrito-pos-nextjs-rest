'use server'
//import { apiClientDq } from "@/lib/fetch-helper";
//import { FileUploadResponse } from "@/app/model/file-uploads-model";
//import { FileUploadData } from "@/app/model/file-uploads-model";
//import { ApiOperationNames } from "@/app/model/api-model";

import { auth } from "@/auth";

import { ProductSellingPricesData } from "@/app/model/products-model";

const base = process.env.APP_API_SERVER_DQ_URL || "http://172.104.117.139:3000/v1/dq"

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


export async function apiComplexDq<TResponse, TBody = unknown>(
    entity: string,
    queryName: string,
    operation: ApiOperationNames,
    id?: string,
    options: FetchOptions<TBody> = {}
  ): Promise<TResponse> {
    const { method = 'GET', body, headers = {}, timeout = 10000 } = options;
  
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let token, apiKey
    const session = await auth();
    if (session?.user?.accessToken) {
        token= session?.user?.accessToken
    }
    if (session?.user?.apiKey) {
        apiKey = session?.user?.apiKey
    }

    const base = process.env.APP_API_SERVER_DQ_URL || "http://172.104.117.139:3000/v1/dq"
    
    const operationConfig: Record<ApiOperationNames, { dqMethod: string; url: string }> = {
      [ApiOperationNames.Create]: { dqMethod: "POST", url: `${base}/entities/${apiKey}/${entity}/Create` },
      [ApiOperationNames.FindAll]: { dqMethod: "POST", url: `${base}/complex/execute/${apiKey}/${queryName}/${id}` },
      [ApiOperationNames.FindOne]: { dqMethod: "GET", url: `${base}/entities/${apiKey}/${entity}/FindOne/${id}` },
      [ApiOperationNames.Delete]: { dqMethod: "DELETE", url: `${base}/entities/${apiKey}/${entity}/Delete/${id}` },
      [ApiOperationNames.Update]: { dqMethod: "PUT", url: `${base}/entities/${apiKey}/${entity}/Update/${id}` },
      [ApiOperationNames.FileUpload]: { dqMethod: "POST", url: `${base}/files/upload/${apiKey}/${entity}` },
    };
    
    // Fallback to default if operation is not found
    const { dqMethod, url } = operationConfig[operation] || {
      dqMethod: "POST",
      url: `${base}/entities/${apiKey}/${entity}/${operation}/find`,
    };

    try {
      const response = await fetch(url, {
        method: dqMethod,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
  
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error) {
          throw new Error(errorData.message || `HTTP Error: ${response.status} ${errorData.error} method=${method} url=${url}`);
        }
        throw new Error(errorData.message || `HTTP Error: ${response.status} method=${method} url=${url}`);
        
      }
  
      return (await response.json()) as TResponse;
    } catch (error) {
      console.log('err from catch ', error)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
