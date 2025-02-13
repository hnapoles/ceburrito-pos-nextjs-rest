"use client"

import React, { useEffect, useState, useRef } from "react";
//import { usePathname } from 'next/navigation';
import Image from "next/image";

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

import { revalidateAndRedirectUrl } from "@/lib/revalidate-path";

import { ZodSchemaProduct, ProductData } from "@/app/model/products-model";
import { Lookup } from "@/app/model/lookups-model";

import { DeleteProductService } from "./deleteProductService";

const defaultValues: ProductData = {
    name: "",
    description: "",
    price: 0.00,
    type: "",
    category: "",
    imageUrl: "",
}


export default function ProductEditForm({types, categories}:{types:Lookup[], categories:Lookup[]}) {
    
    //const pathname = usePathname();

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


    return (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        <Card className="w-full">
            <CardHeader>
                <CardTitle>User</CardTitle>
                <CardDescription>
                    Edit user.
                </CardDescription>
            </CardHeader>
           
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        
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
                                    <FormDescription>
                                        This is a unique name{" "}.
                                    </FormDescription>
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
                                    <FormDescription>
                                        This describes about the product.{" "}.
                                    </FormDescription>
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
                                    <FormDescription>
                                        This describes about the product.{" "}.
                                    </FormDescription>
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
                                        type="file"
                                        placeholder=""
                                        accept="image/*"
                                        {...field} />
                                    <FormDescription>
                                        This is the product image.{" "}.
                                    </FormDescription>
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
                                        {...field} />
                                    <FormDescription>
                                        Thi is the selling price.{" "}.
                                    </FormDescription>
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
                                    <FormDescription>
                                        This is the product type.{" "}
                                    </FormDescription>
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
                                    <FormDescription>
                                        This is the product category.{" "}
                                    </FormDescription>
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
             {/* Right Side - Image Preview */}
           
            <div className="flex justify-center items-center border-2 border-dashed rounded-lg h-48">
                            {preview ? (
                            <Image src={preview} alt="Preview" width={200} height={200} className="rounded-lg object-cover" />
                            ) : (
                            <span className="text-gray-500">No image selected</span>
                            )}
            </div>
           
           
        </Card>
        </div>
        

    )
}
