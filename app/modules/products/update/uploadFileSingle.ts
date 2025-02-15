'use server'
import { apiClientDq } from "@/lib/fetch-helper";

import { FileUploadResponse } from "@/app/model/file-uploads-model";
import { ApiOperationNames } from "@/app/model/api-model";

import { InputFileProps } from "@/app/model/file-uploads-model";
 
export async function UploadFileSingle(data: InputFileProps, entity: string) {

    const operation = ApiOperationNames.FileUpload;
    const id = "";
    const method = 'POST';

    const result = await apiClientDq<FileUploadResponse, InputFileProps>(entity, operation, id, 
        { method: method,
        body: data,});

    return result;
}