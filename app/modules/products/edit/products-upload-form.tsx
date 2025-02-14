"use client"

import React, { ChangeEvent, useState, useRef } from 'react';
import { useForm } from "react-hook-form";

import Image from 'next/image'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button";


interface InputFileProps {
  // You can add any additional props needed
  file: FileList | null;
}

export default function InputFile() {

  const { register, setValue, handleSubmit, watch, reset } = useForm<InputFileProps>();

  const watchFile = watch("file");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

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
    reset(); 
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input field
    }
    
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (data: InputFileProps) => {
    if (data.file && data.file.length > 0) {
      console.log("File uploaded:", data.file[0]);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        Click Image to assign to selected product.
                                <div className="flex  border-2 border-dashed rounded-lg h-48" >
        
                                        {selectedFile ? (
                                            <div className="mt-2 relative">
                                                    <Image src={selectedFile} alt="Preview" width={200} height={200} className="rounded-lg object-cover" />
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
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {/*<Label htmlFor="picture">Picture</Label>*/}
      <Input id="picture" className="xhidden" type="file"  {...register("file")} onChange={handleFileChange} ref={fileInputRef}  />
      {/* Button to Trigger File Selection */}
      <Button type="button" onClick={handleButtonClick}>
        Select File
      </Button>
      {selectedFile && (
        <div className="mt-2 relative">
          <Image
            src={selectedFile}
            alt="Preview"
            width={200}
            height={200}
          />
          <button
            onClick={handleRemoveClick}
            className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2"
            aria-label="Remove image"
          >
            X
          </button>
        </div>
      )}
    </div>
    </form>
  );
}


