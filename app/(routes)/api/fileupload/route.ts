import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const base =
  process.env.NEXT_PUBLIC_APP_API_SERVER_DQ_URL ||
  'http://172.104.117.139:3000/v1/dq';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // ✅ Read FormData from request
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // ✅ Store file in custom storage (replace with actual upload logic)
    //const buffer = await file.arrayBuffer();
    console.log('Received file:', file);

    // Prepare a new FormData object to forward to the external API
    const forwardFormData = new FormData();
    forwardFormData.append('file', file);

    let token, apiKey;
    const session = await auth();
    if (session?.user?.accessToken) {
      token = session?.user?.accessToken;
    }
    if (session?.user?.apiKey) {
      apiKey = session?.user?.apiKey;
    }

    const url = `${base}/files/upload/${apiKey}/product`;
    const method = 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          //'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: forwardFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP Error: ${response.status} method=${method} url=${url}`,
        );
      }

      //return (await response.json()) as TResponse;
      const res = await response.json();
      return NextResponse.json(res);
    } catch (error) {
      console.log('err from catch ', error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }

    return NextResponse.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

/*
import { apiClientDq } from "@/lib/fetch-helper";

import { FileUploadResponse } from "@/app/model/file-uploads-model";
import { ApiOperationNames } from "@/app/model/api-model";

import { FileUploadData } from "@/app/model/file-uploads-model";
 
export async function UploadFileSingle(data: FileUploadData, entity: string) {

    const operation = ApiOperationNames.FileUpload;
    const id = "";
    const method = 'POST';

    try {
        const result = await apiClientDq<FileUploadResponse, FileUploadData>(entity, operation, id, 
            { method: method,
            body: data,});
            return result;
    } catch (error) {
        console.log(error)
    }
    

*/
