type ApiResponse<T> = {
    data: T | null
    error: string | null
    status: number | null
  }
  
  type ApiOptions = RequestInit & {
    token?: string
  }
  
  export async function fetchApi<T>(url: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
    const { token, ...fetchOptions } = options
  
    try {
      const headers = new Headers(fetchOptions.headers)
      headers.set("Content-Type", "application/json")
  
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
  
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })
  
      if (!response.ok) {
        return {
          data: null,
          error: `HTTP error! status: ${response.status}`,
          status: response.status,
        }
      }
  
      const data = await response.json()
  
      if (data.error) {
        return {
          data: null,
          error: data.error,
          status: response.status,
        }
      }
  
      return {
        data: data as T,
        error: null,
        status: response.status,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "An unknown error occurred",
        status: null,
      }
    }
  }
  
  export async function postApi<T>(
    url: string,
    body: Record<string, unknown>,
    options: ApiOptions = {},
  ): Promise<ApiResponse<T>> {
    return fetchApi<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    })
  }
  
