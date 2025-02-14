"use client"

import React, { ChangeEvent, useState, useRef } from 'react';
import { useForm } from "react-hook-form";

import Image from 'next/image'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils"

import { UploadedFileData } from 'uploadthing/types';
import { UploadedFilesCard } from './files-uploaded-card';


const uploadedFiles = [{
    "key": "67ae73a32b9617d42ff520dd",
    "customId": "product",
    "name": "104821ed-cfe4-43ff-8efa-9fc8a8826dbc.png",
    "url": "https://posapi-dev.ceburrito.ph/public/104821ed-cfe4-43ff-8efa-9fc8a8826dbc.png",
  },

  ]



interface InputFileProps {
  // You can add any additional props needed
  file: File | null;
}

export default function InputFile() {

  const { register, setValue, handleSubmit, 
    //watch, 
    reset } = useForm<InputFileProps>();

  //const watchFile = watch("file");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setValue("file", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveClick = () => {
    setValue("file", null); // Clear the form value
    setSelectedFile(null);
    reset({ file: null }); // Ensure form state resets
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input field
    }
    
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: InputFileProps) => {
    if (data.file) {
      console.log("File uploaded:", data.file);
    } else {
      console.log("No file selected");
    }
  };

  /*
   <div className="flex border-2 border-dashed rounded-lg h-48" > 
  */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

       

                                <div className="flex border-2 border-dashed rounded-lg h-48" >
                            
                                        {selectedFile ? (
                                            <div className="relative space-x-4 pb-4">
                                                    <Image src={selectedFile} alt="Preview" width={100} height={130} 
                                                    className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square" />
                                                    <button
                                                    onClick={handleRemoveClick}
                                                    className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2"
                                                    aria-label="Remove image"
                                                    >X</button>
                                                   
                                            </div>
                                        
                                        ) : (
                                        <span className="text-gray-500 justify-center items-center">No image selected</span>
                                        )}
                                </div>
                                <Input id="file" className="hidden" type="file"  {...register("file")}  ref={fileInputRef} onChange={handleFileChange} />
                                {/*
                                {watchFile && (
                                    <p className="text-sm text-gray-500 text-center mt-2">
                                    Selected File: {watchFile.name}
                                    </p>
                                )}*/}
                                <Button  type="button" variant="outline" onClick={handleButtonClick} 
                                   className={cn("w-full", selectedFile ? "hidden" : "block")}>
                                    Browse Images for Upload
                                </Button>
                                <Button type="submit"  className={cn("w-full", selectedFile ? "block" : "hidden")}>
                                    Upload Selected Image to Library
                                </Button>
      
    </form>
  );
}


