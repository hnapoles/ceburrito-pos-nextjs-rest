import { auth } from "@/auth";
import { ApiOperationNames } from "@/app/model/api-model";

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions<T = unknown> {
  method?: FetchMethod;
  body?: T;
  headers?: HeadersInit;
  token?: string;
  timeout?: number; // Timeout in milliseconds
}

export async function apiClient<TResponse, TBody = unknown>(
  url: string,
  options: FetchOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', body, headers = {}, token, timeout = 10000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
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
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}


export async function apiClientWithSession<TResponse, TBody = unknown>(
    url: string,
    options: FetchOptions<TBody> = {}
  ): Promise<TResponse> {
    const { method = 'GET', body, headers = {}, timeout = 10000 } = options;
  
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let token
    const session = await auth();
    if (session?.user.accessToken) {
        token= session.user.accessToken
    }
  
    try {
      const response = await fetch(url, {
        method,
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
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }
  
      return (await response.json()) as TResponse;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }

  export async function apiClientDq<TResponse, TBody = unknown>(
    entity: string,
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
    
    //let url = "";
    //let dqMethod = 'GET'
    /*
    switch (operation) {
      case ApiOperationNames.Create:
        dqMethod = 'POST'
        url = `${base}/entities/${apiKey}/${entity}/${operation}`;
        break;
      case ApiOperationNames.FindAll:
        dqMethod = 'POST'
        url = `${base}/entities/${apiKey}/${entity}/${operation}/find`;
        break;
      case ApiOperationNames.FindOne:
        dqMethod = 'GET'
        url = `${base}/entities/${apiKey}/${entity}/${operation}/${id}`;
        break;
      case ApiOperationNames.Delete:
        dqMethod = 'DELETE'
        url = `${base}/entities/${apiKey}/${entity}/${operation}/${id}`;
        break;
      case ApiOperationNames.Update:
        dqMethod = 'PUT'
        url = `${base}/entities/${apiKey}/${entity}/${operation}/${id}`;
        break;
      default:
        dqMethod = 'POST'
        url = `${base}/entities/${apiKey}/${entity}/${operation}/find`;
        break;
    }
    */

    const operationConfig: Record<ApiOperationNames, { dqMethod: string; url: string }> = {
      [ApiOperationNames.Create]: { dqMethod: "POST", url: `${base}/entities/${apiKey}/${entity}/Create` },
      [ApiOperationNames.FindAll]: { dqMethod: "POST", url: `${base}/entities/${apiKey}/${entity}/FindAll/find` },
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

/* how to use examples */
/*
import { apiClient } from '@/utils/apiClient';

async function fetchUsers() {
  try {
    const users = await apiClient<User[]>('https://api.example.com/users');
    console.log(users);
  } catch (error) {
    console.error(error);
  }
}

import { apiClient } from '@/utils/apiClient';

async function createUser() {
  try {
    const newUser = await apiClient<User, { name: string }>('https://api.example.com/users', {
      method: 'POST',
      body: { name: 'John Doe' },
    });
    console.log(newUser);
  } catch (error) {
    console.error(error);
  }
}


import { apiClient } from '@/utils/apiClient';

async function fetchProfile(token: string) {
  try {
    const profile = await apiClient<User>('https://api.example.com/profile', { token });
    console.log(profile);
  } catch (error) {
    console.error(error);
  }
}

import { apiClient } from '@/utils/apiClient';

async function fetchWithTimeout() {
  try {
    const data = await apiClient<DataType>('https://api.example.com/slow-endpoint', { timeout: 5000 });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
*/