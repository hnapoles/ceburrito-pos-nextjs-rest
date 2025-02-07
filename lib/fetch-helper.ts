import { auth } from "@/auth";

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