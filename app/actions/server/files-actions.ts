'use server';

import { auth } from '@/auth';

const base =
  process.env.APP_API_SERVER_DQ_URL || 'http://172.104.117.139:3000/v1/dq';

export async function UploadFileSingle(data: FormData, entity: string) {
  let token, apiKey;
  const session = await auth();
  if (session?.user?.accessToken) {
    token = session?.user?.accessToken;
  }
  if (session?.user?.apiKey) {
    apiKey = session?.user?.apiKey;
  }

  const url = `${base}/files/upload/${apiKey}/${entity}`;
  const method = 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        //'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error) {
        throw new Error(
          errorData.message ||
            `HTTP Error: ${response.status} ${errorData.error} method=${method} url=${url}`,
        );
      }
      throw new Error(
        errorData.message ||
          `HTTP Error: ${response.status} method=${method} url=${url}`,
      );
    }

    //return (await response.json()) as TResponse;
    const res = await response.json();
    return res;
  } catch (error) {
    console.log('err from catch ', error);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}
