import { auth } from "@/auth";


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
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error Status:', error.response.status);
        console.error('Error Message:', error.response.data.message || 'Unknown error');

        // Access the full error response if needed
        console.log('Full Error Response:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
      } else {
        // Something else happened while setting up the request
        console.error('Error:', error.message);
      }
    } else {
      // Handle non-Axios errors (unexpected errors)
      console.error('Unexpected Error:', error);
    }


    //console.error(`Error in API Request [${method} ${url}]:`, error);
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
    return response.data;
  } catch (error) {
    console.error(`Error in Dq API Request [${method} ${url}]:`);
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      if (error.response) {
        // Server responded with a status other than 2xx
        //console.error('Error Status:', error.response.status);
        //console.error('Error Message:', error.response.data.message || 'Unknown error');

        // Access the full error response if needed
        if (error && error.response && error.response.data) console.log('Full Error Response:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
      } else {
        // Something else happened while setting up the request
        console.error('Error:', error.message);
      }
    } else {
      // Handle non-Axios errors (unexpected errors)
      console.error('Unexpected Error:', error);
    }

    //console.error(`Error in Dq API Request [${method} ${url}]:`, error);
    throw error;
  }
};

export default axiosInstance;