// utils/apiClient.ts

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    status?: number;
  }
  
  export async function apiClient<T>(
    url: string,
    options: RequestInit = {},
    timeout: number = 5000 // 5-second timeout
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
  
      clearTimeout(timer);
  
      if (!response.ok) {
        return {
          success: false,
          error: `API Error: ${response.status} ${response.statusText}`,
          status: response.status,
        };
      }
  
      const data = (await response.json()) as T;
      return { success: true, data };
    } catch (error) {
      clearTimeout(timer);
  
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { success: false, error: 'Request timed out' };
      }
  
      return { success: false, error: 'Network error or server is down' };
    }
  }
  