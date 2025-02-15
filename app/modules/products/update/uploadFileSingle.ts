'use server'
import { apiClientDq } from "@/lib/fetch-helper";

import { FileUploadResponse } from "@/app/model/file-uploads-model";
import { ApiOperationNames } from "@/app/model/api-model";

import { FileUploadData } from "@/app/model/file-uploads-model";

import { auth } from "@/auth";

const base = process.env.APP_API_SERVER_DQ_URL || "http://172.104.117.139:3000/v1/dq"

 
export async function UploadFileSingle(data: any, entity: string) {

    const operation = ApiOperationNames.FileUpload;
    const id = "";
    //const method = 'POST';

    let token, apiKey
            const session = await auth();
            if (session?.user?.accessToken) {
                token = session?.user?.accessToken
            }
            if (session?.user?.apiKey) {
                apiKey = session?.user?.apiKey
            }
    
            const url = `${base}/files/upload/${apiKey}/product`
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
                  throw new Error(errorData.message || `HTTP Error: ${response.status} method=${method} url=${url}`);
                }
            
                //return (await response.json()) as TResponse;
                const res = await response.json()
                //return NextResponse.json(res);
                return res;
              } catch (error) {
                console.log('err from catch ', error)
                if (error instanceof Error && error.name === 'AbortError') {
                  throw new Error('Request timed out');
                }
                throw error;
              }


    /*
    try {
        const result = await apiClientDq<FileUploadResponse, any>(entity, operation, id, 
            { method: method,
            body: data,});
            return result;
    } catch (error) {
        console.log(error)
    }
    */
    

   
}