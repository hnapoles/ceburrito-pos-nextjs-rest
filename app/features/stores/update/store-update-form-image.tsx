'use client'
import React, { ChangeEvent, useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import Image from "next/image";

import { Upload } from "lucide-react"

import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils"

const entity = 'store';

import { InputFileProps } from '@/app/model/file-uploads-model';
import { UploadFileSingle } from '@/app/action/server/files-actions';
import { toast } from "@/hooks/use-toast";

const base = process.env.APP_API_SERVER_URL || "https://posapi-dev.ceburrito.ph"

export default function StoreUpdateFormImage({ imageUrl, setImageUrl }: { imageUrl: string | null; setImageUrl: React.Dispatch<React.SetStateAction<string | null>> }) {
    const {
        register,
        setValue,
        handleSubmit,
        //watch, 
        reset } = useForm<InputFileProps>();

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

    const onSubmit = async (data: InputFileProps) => {
        if (data.file) {

            const formData = new FormData();
            formData.append("file", data.file);

            const uploaded = await UploadFileSingle(formData, entity);
            //console.log(uploaded);
            //console.log("File uploaded:", data.file);
            const newImageUrl = `${base}/public/${uploaded.fileName}`
            setImageUrl(newImageUrl);
            setSelectedFile(null);

            toast({
                title: "Data saved",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(uploaded, null, 2)}</code>
                    </pre>
                ),
            });
        } else {
            console.log("No file selected");
        }
    };

    if (imageUrl) {
        //const newImageUrl = `${base}/public/${imageUrl}`
        //console.log(newImageUrl)
        //const aspectRatio = "square";
        return (

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {!selectedFile && 
                <div className="relative">
                    <div className="flex space-x-4 pb-4"  onClick={handleButtonClick} >

                        <Image
                            src={imageUrl}
                            alt="image"
                            width={100}
                            height={100}
                            className={cn(
                                "h-auto w-auto object-cover transition-all hover:scale-105",
                                "aspect-square"
                            )}
                        
                        />

                    </div>
                </div>
                }
                {selectedFile && (
                 
                     <div className="relative space-x-4 pb-4">
                            <Image src={selectedFile} alt="Preview" width={100} height={130}
                                className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square" />
                            <button
                                onClick={handleRemoveClick}
                                className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2"
                                aria-label="Remove image"
                            >X</button>
                            {/* Center the button */}
                            <div className="flex justify-center w-full">
                                <Button
                                    type="submit"
                                    className={cn("w-1/2", selectedFile ? "block" : "hidden")}
                                >
                                    Upload
                                </Button>
                            </div>
                    </div>

                

               
                  )}
                <div>
                    <Input id="file" className="hidden" type="file"  {...register("file")} ref={fileInputRef} onChange={handleFileChange} />
                </div>
            </form>

        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-2 md:gap-6">
                <div className="flex flex-row items-center justify-center gap-4 sm:px-5 border-2 border-dashed py-2">
                    {selectedFile ? (
                        <div className="relative space-x-4 pb-4">
                            <Image src={selectedFile} alt="Preview" width={100} height={130}
                                className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-square" />
                            <button
                                onClick={handleRemoveClick}
                                className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2"
                                aria-label="Remove image"
                            >X</button>
                            {/* Center the button */}
                            <div className="flex justify-center w-full">
                                <Button
                                    type="submit"
                                    className={cn("w-1/2", selectedFile ? "block" : "hidden")}
                                >
                                    Upload
                                </Button>
                            </div>

                        </div>


                    ) : (
                       
                        <div className="items-center flex flex-row" onClick={handleButtonClick}>

                            <div className="rounded-full border border-dashed p-3">
                                <Upload
                                    className="size-7 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="flex flex-col gap-px p-4">

                                <p className="text-sm text-muted-foreground/70">
                                    Browse Images for Upload
                                </p>
                            </div>
                        </div>
                        
                    )}

                </div>

                <div>
                    <Input id="file" className="hidden" type="file"  {...register("file")} ref={fileInputRef} onChange={handleFileChange} />
                </div>
            </div>
        </form>
    )

}