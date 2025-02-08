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


import { NewUserFormSchema } from "../models/users.form.schema"
import { createUserService } from "../services/users.service"


import { revalidateAndRedirectUrl } from "@/app/service/revalidate-path";



export default function UserCreateForm() {
    const emailInputRef = useRef<HTMLInputElement>(null); // Ref for the email input field

    const form = useForm<z.infer<typeof NewUserFormSchema>>({
        resolver: zodResolver(NewUserFormSchema),
        defaultValues: {
            username: "",
            password: "",
            email: "",
            primaryRole: "",
          },
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

        /*
        if (email && !form.formState.errors.email) {
            const emailExists = await checkEmailExistsService(email)
            if (emailExists) {
              form.setError("email", {
                type: "manual",
                message: "This email is already registered",
              })
              emailInputRef.current?.focus()
            } else {
              form.clearErrors("email")
            }
        } 
        */

        /*
        //const email = getValues("email");

        try {
            // Perform Zod validation first
            const isValid = await trigger("email"); // Triggers validation for "email" only
            if (!isValid) {
               
                emailInputRef.current?.focus();
                return; // Exit if Zod validation fails
            }

            const emailExist = await checkEmailExistsService(email);

            if (emailExist) {
                form.setError("email", {
                    type: "manual",
                    message: "Email already exists.",
                });
               
                emailInputRef.current?.focus();
            } else {
                clearErrors("email");
            }
        } catch (error) {
            setError("email", {
                type: "manual",
                message: "An error occurred. Please try again.",
            });
            
            emailInputRef.current?.focus();
        }
            */
    };

    async function onSubmit(data: z.infer<typeof NewUserFormSchema>) {
        console.log('create form data');
        console.log(data);
        const userCreate = await createUserService(data);
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="user@email.com"
                                        {...field}
                                       
                                        onKeyDown={async (e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault()
                                              await validateEmailOnBlur(field.value)
                                            }
                                          }}
                                          ref={emailInputRef} // Attach ref to the input
                                        disabled={isSubmitting}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Name</FormLabel>
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
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
                            name="primaryRole"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primary Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue="">
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user primary role" />
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
