"use client"

import React, { useEffect, useState, useRef } from "react";
//import { usePathname } from 'next/navigation';
import Image from "next/image";

import { cn } from "@/lib/utils"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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

import { ZodSchemaEditProduct, EditProductData } from "@/app/model/products-model";
import { Lookup } from "@/app/model/lookups-model";

import { DeleteProductService } from "./deleteProductService";

import InputFile from "./products-upload-form";

const images = [{
    "_id": {
      "$oid": "67ae73a32b9617d42ff520dd"
    },
    "group": "product",
    "description": "heart",
    "fileName": "https://posapi-dev.ceburrito.ph/public/104821ed-cfe4-43ff-8efa-9fc8a8826dbc.png",
    aspectRatio : "square",
  },
  {
    "_id": {
      "$oid": "67ae75962b9617d42ff520e1"
    },
    "group": "product",
    "description": "heart",
    "fileName": "https://posapi-dev.ceburrito.ph/public/10358cc7-b729-4339-857d-d908bd5be67d.png",
    aspectRatio : "square",
},
  {
    "_id": {
      "$oid": "https://posapi-dev.ceburrito.ph/public/67ae75c32b9617d42ff520e3"
    },
    "group": "product",
    "description": "heart",
    "fileName": "https://posapi-dev.ceburrito.ph/public/3f148182-1b86-4df9-9e43-938cc74324fc.png",
    aspectRatio : "square",
  }]


export default function ProductEditForm({product, types, categories}:{product: EditProductData, types:Lookup[], categories:Lookup[]}) {
    
    //const pathname = usePathname();

    const defaultValues: EditProductData = {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price | 0.00,
        type: product.type,
        category: product.category,
        imageUrl: product?.imageUrl ?? "",
    }

    const [preview, setPreview] = useState<string | null>(null);


    const form = useForm<EditProductData>({
        resolver: zodResolver(ZodSchemaEditProduct),
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
        formState: { errors, isSubmitting },
    } = form;

    // Watch file input changes
    //const selectedFile = watch("file") as FileList | undefined;;

    // Generate image preview
    /*
    const handleFileChange = () => {
        const files = getValues("file"); // Correctly retrieves FileList

        if (files && files.length > 0) {
          const file = files[0]; // This is now properly recognized as a File
          setPreview(URL.createObjectURL(file));
        }
    };
    */

    //const validateEmailOnBlur = async (email: string) => {    
    //};

    async function onSubmit(data: EditProductData) {
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
                                        <FormItem>
                                            <FormLabel>Image Url</FormLabel>
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
                        
                        <InputFile/>
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
