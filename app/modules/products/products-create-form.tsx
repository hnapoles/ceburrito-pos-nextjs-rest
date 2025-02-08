"use client"

import React, { useEffect, useState, useRef } from "react";

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

import { revalidateAndRedirectUrl } from "@/app/service/revalidate-path";

import { ZodSchemaNewProduct, NewProductData } from "@/app/model/products-model";

const defaultValues: NewProductData = {
    name: "",
    description: "",
    category: ""
}


export default function UserCreateForm() {
    const emailInputRef = useRef<HTMLInputElement>(null); // Ref for the email input field

    const form = useForm<NewProductData>({
        resolver: zodResolver(ZodSchemaNewProduct),
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
        formState: { errors, isSubmitting },
    } = form;

    const validateEmailOnBlur = async (email: string) => {

        
    };

    async function onSubmit(data: NewProductData) {
        console.log('create form data');
        console.log(data);
        //const userCreate = await createUserService(data);
        console.log(userCreate);
        if (!userCreate.success) {
                form.setError("email", {
                type: "manual",
                message: userCreate.message,
              })
              emailInputRef.current?.focus()
        }
        
        toast({
            title: "Data saved for user",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
        revalidateAndRedirectUrl('/dashboard/settings/users');
    }

    const [roles, setRoles] = useState<string[]>([]);
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch("/api/userRoles");
                if (!response.ok) {
                    throw new Error("Failed to fetch roles");
                }
                const data: string[] = await response.json();
                setRoles(data);
            } catch (error: any) {
                console.error(error);
            } finally {

            }
        };
        fetchRoles();

    }, []);

    return (
        <Card>
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
                                        This is a secret password{" "}.
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
                                            {roles.map((role) => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}

                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        This is defines user permissions and access{" "}
                                        <Link href="/examples/forms">email settings</Link>.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="mt-6 flex justify-end gap-4">
                            <Link
                                href="/pos/settings/users2"
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

    )
}
