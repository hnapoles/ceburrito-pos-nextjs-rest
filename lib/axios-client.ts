import { auth } from "@/app/modules/auth/services/auth";


import axios, { AxiosInstance, 
  //AxiosRequestConfig, 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  Method } from 'axios';
//import { getSession } from 'next-auth/react';

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com', // Default base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to Attach Token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    
    const session = await auth();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
      
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Utility Function for Dynamic Requests
interface RequestOptions {
  url: string;
  method?: Method;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// Utility Function for Dynamic Requests
interface DqRequestOptions {
  operation: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export const apiRequest = async <T>({ url, method = 'GET', data, params, headers }: RequestOptions): Promise<T> => {
  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data,
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Error in API Request [${method} ${url}]:`, error);
    throw error;
  }
};

export const apiDq = async <T>({ operation, data, params, headers }: DqRequestOptions): Promise<T> => {

  //all Dq calls are POST
  const method = 'POST'
  const base = process.env.HOST_DQ_URL || "http://172.104.117.139:3000/v1/dq"

  //get apiKey from session
  var apiKey = ""
  const session = await auth();
  if (session?.apiKey) {
      apiKey = session?.apiKey
  }

  const url = `${base}/${operation}/${apiKey}`

  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data,
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Error in Dq API Request [${method} ${url}]:`, error);
    throw error;
  }
};

export default axiosInstance;