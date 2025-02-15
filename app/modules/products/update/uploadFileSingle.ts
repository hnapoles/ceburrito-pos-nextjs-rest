'use server'
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
    

   
}