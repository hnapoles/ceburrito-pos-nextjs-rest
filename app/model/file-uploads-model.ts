import { type ClientUploadedFileData } from "uploadthing/types"

export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}


export interface InputFileProps {
    file: File | null;
}

export interface FileUploadResponse {
    entity: string,
    fileName: string,
    message: string
}

export interface FileUploadData {
    file?: File | null;
}