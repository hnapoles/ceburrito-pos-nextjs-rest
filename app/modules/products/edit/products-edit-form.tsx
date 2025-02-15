"use client"

import React, { useEffect, useState, useRef, ChangeEvent } from "react";
//import { usePathname } from 'next/navigation';
import Image from "next/image";

import { cn } from "@/lib/utils"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { FileText, Upload, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Input
} from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    //CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator"

import { revalidateAndRedirectUrl } from "@/lib/revalidate-path";

import { ZodSchemaProduct, ProductData } from "@/app/model/products-model";
import { Lookup } from "@/app/model/lookups-model";

import { DeleteProductService } from "./deleteProductService";

import InputFile from "./products-upload-form";
import { FileUploadReactHookForm } from "../../file-uploads/files-upload-react-hook-form";

const images = [{
    "_id": {
        "$oid": "67ae73a32b9617d42ff520dd"
    },
    "group": "product",
    "description": "heart",
    "fileName": "https://posapi-dev.ceburrito.ph/public/104821ed-cfe4-43ff-8efa-9fc8a8826dbc.png",
    aspectRatio: "square",
},
{
    "_id": {
        "$oid": "67ae75962b9617d42ff520e1"
    },
    "group": "product",
    "description": "heart",
    "fileName": "https://posapi-dev.ceburrito.ph/public/10358cc7-b729-4339-857d-d908bd5be67d.png",
    aspectRatio: "square",
},
{
    "_id": {
        "$oid": "https://posapi-dev.ceburrito.ph/public/67ae75c32b9617d42ff520e3"
    },
    "group": "product",
    "description": "heart",
    "fileName": "https://posapi-dev.ceburrito.ph/public/3f148182-1b86-4df9-9e43-938cc74324fc.png",
    aspectRatio: "square",
}]

const entity = 'product';

interface InputFileProps {
    // You can add any additional props needed
    file: File | null;
  }

export default function ProductEditForm({ product, types, categories }: { product: ProductData, types: Lookup[], categories: Lookup[] }) {





    //const pathname = usePathname();

    const defaultValues: ProductData = {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price | 0.00,
        type: product.type,
        category: product.category,
        imageUrl: product?.imageUrl ?? "",
    }

    const [preview, setPreview] = useState<string | null>(null);


    const form = useForm<ProductData>({
        resolver: zodResolver(ZodSchemaProduct),
        defaultValues: defaultValues,
        mode: "onBlur",
    })


    const {
        register,
        //handleSubmit,
        setError,
        clearErrors,
        trigger, // For triggering validation onBlur
        getValues,
        setFocus,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = form;

    const imageUrl = watch("imageUrl");


    async function onSubmit(data: ProductData) {
        console.log('create form data');
        console.log(data);
        const productCreated = await DeleteProductService(data);

        toast({
            title: "Data saved for user",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(productCreated, null, 2)}</code>
                </pre>
            ),
        });
        revalidateAndRedirectUrl('/dashboard/products');
    }


    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        //setValue("file", file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveClick = () => {
        //setValue("file", null); // Clear the form value
        setSelectedFile(null);
        //reset({ file: null }); // Ensure form state resets
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input field
        }

    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };


    return (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            <div>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Product</CardTitle>
                        <CardDescription>
                            Edit product.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Image Upload */}
                        <div className="grid md:grid-cols-3 gap-2 md:gap-6">
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5 border-2 border-dashed py-2">
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
                            

                        </div>
                        <div className="flex justify-end">

                                    <Input id="file" className="hidden" type="file" ref={fileInputRef} onChange={handleFileChange} />
                                
                               
                                <Button type="submit"  className={cn("w-full", selectedFile ? "block" : "hidden")}>
                                    Upload Selected Image to Library
                                </Button>

                                </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:space-y-3 space-y-1">



                                <FormField
                                    control={form.control}
                                    name="_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Id</FormLabel>
                                            <Input
                                                placeholder=""
                                                readOnly {...field} />
                                            <FormDescription>
                                                This is a system generated id{" "}.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                {...field} />

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                {...field} />

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                {...field} />

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem className="hidden">
                                            <FormLabel>Image Url</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                className="hidden"

                                                {...field} />
                                            

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...field} />

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue="">
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select product type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {types.map((l) => (
                                                        <SelectItem key={l.lookupValue} value={l.lookupValue}>{l.lookupDescription}</SelectItem>
                                                    ))}

                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue="">
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select product category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((l) => (
                                                        <SelectItem key={l.lookupValue} value={l.lookupValue}>{l.lookupDescription} </SelectItem>
                                                    ))}

                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="mt-6 flex justify-end gap-4">
                                    <Link
                                        href="/dashboard/products/create"
                                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                                    >
                                        Cancel
                                    </Link>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </Button>
                                </div>

                            </form>
                        </Form>

                    </CardContent>



                </Card>
            </div>



            {/* Right Side */}
            <div>

                <Tabs defaultValue="images">
                    <div className="flex items-center">
                        <TabsList>
                            <TabsTrigger value="images">Images</TabsTrigger>
                            <TabsTrigger value="active">Attributes</TabsTrigger>
                            <TabsTrigger value="draft">Sales</TabsTrigger>

                        </TabsList>


                    </div>
                    <TabsContent value="images">

                        <FileUploadReactHookForm entity={entity} />
                        <InputFile />
                        <div className="mt-6 space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Image Library
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Click image to assign to the product.
                            </p>
                        </div>
                        <Separator className="my-4" />
                        <div className="relative">

                            <div className="flex space-x-4 pb-4">
                                {images.map((image) => (
                                    <Image
                                        key={image.fileName}
                                        src={image.fileName}
                                        alt={image.description}
                                        width={100}
                                        height={100}
                                        className={cn(
                                            "h-auto w-auto object-cover transition-all hover:scale-105",
                                            image.aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                                        )}
                                    />
                                ))}
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>



            </div>
        </div>


    )
}
