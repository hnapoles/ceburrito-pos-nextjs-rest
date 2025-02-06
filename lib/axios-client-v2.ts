import { auth } from "@/auth";

export type ApiResponse<T> = {
    data: T | null
    error: string | null
}
  

import axios, { AxiosInstance, 
  //AxiosRequestConfig, 
  InternalAxiosRequestConfig, 
  AxiosResponse, 
  Method, type AxiosError } from 'axios';
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
    if (session?.user.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
      
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {

    if (error && error.reponse && error.reponse.data) console.error('API Error Data:', error.response.data);
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

export const apiRequest = async <T>({ url, method = 'GET', data, params, headers }: RequestOptions): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data,
      params,
      headers,
    });
    return {data: response.data, error: null};
  } catch (error) {
    console.error(`Error in Dq API Request [${method} ${url}]:`);
    console.error("API call failed:", error)
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        // Access the full error response if needed
        let errResponseData = null;
        if (axiosError && axiosError.response && axiosError.response.data && axiosError.response.data) {
            errResponseData = axiosError.response.data;
            console.error('Full Error Response:', axiosError.response.data);
        }
        return {
          data: null,
          error: `Server error: ${axiosError.response.status} ${axiosError.response.statusText} ${JSON.stringify(errResponseData)}`,
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        return {
          data: null,
          error: "No response received from server. It might be down or you might be offline.",
        }
      }
    }
    // Something happened in setting up the request that triggered an Error
    return {
      data: null,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  
  }
};



export const apiDq = async <T>({ operation, data, params, headers }: DqRequestOptions):  Promise<ApiResponse<T>> => {

  //all Dq calls are POST
  const method = 'POST'
  const base = process.env.HOST_DQ_URL || "http://172.104.117.139:3000/v1/dq"

  //get apiKey from session
  var apiKey = ""
  const session = await auth();
  if (session?.user.apiKey) {
      apiKey = session?.user.apiKey
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
    return {data: response.data, error: null};
  } catch (error) {
    console.error(`Error in Dq API Request [${method} ${url}]:`);
    console.error("API call failed:", error)
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        // Access the full error response if needed
        let errResponseData = null;
        if (axiosError && axiosError.response && axiosError.response.data && axiosError.response.data) {
            errResponseData = axiosError.response.data;
            console.error('Full Error Response:', axiosError.response.data);
        }
            

        return {
          data: null,
          error: `Server error: ${axiosError.response.status} ${axiosError.response.statusText} ${JSON.stringify(errResponseData)}`,
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        return {
          data: null,
          error: "No response received from server. It might be down or you might be offline.",
        }
      }
    }
    // Something happened in setting up the request that triggered an Error
    return {
      data: null,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  

  }
};

export default axiosInstance;