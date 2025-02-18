'use client'
import React from "react";

//import Image from "next/image";
//import { cn } from "@/lib/utils"

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

import { revalidateAndRedirectUrl } from "@/lib/revalidate-path";

import { ZodSchemaStore, StoreData } from "@/app/model/stores-model";
import { Lookup } from "@/app/model/lookups-model";
import { UpdateStore } from "@/app/action/server/stores-actions";

export default function StoreUpdateFormDetails({ entity, imageUrl }: { entity: StoreData,   imageUrl: string | null }) {

    const defaultValues: StoreData = {
            _id: entity._id,
            name: entity.name,
            imageUrl: entity?.imageUrl ?? "",
            storeAddress: entity?.storeAddress ?? "",
    }

    const form = useForm<StoreData>({
            resolver: zodResolver(ZodSchemaStore),
            defaultValues: defaultValues,
            mode: "onBlur",
        })

        const {
            //register,
            //handleSubmit,
            //setError,
            //clearErrors,
            //trigger, // For triggering validation onBlur
            //getValues,
            //setFocus,
            //watch,
            //setValue,
            //reset,
            formState: { 
                //errors, 
                isSubmitting },
        } = form;

        async function onSubmit(data: StoreData) {
                console.log('create form data');
                console.log(data);
                data = {
                    ...data,
                    imageUrl: imageUrl ?? ""
                }
                const productUpdated = await UpdateStore(data);
        
                toast({
                    title: "Data saved for user",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{JSON.stringify(productUpdated, null, 2)}</code>
                        </pre>
                    ),
                });
                revalidateAndRedirectUrl('/dashboard/stores');
            }


    return (
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
                                            <FormLabel>Store Name</FormLabel>
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
                                    name="storeAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder=""
                                                {...field} />

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
    )

}