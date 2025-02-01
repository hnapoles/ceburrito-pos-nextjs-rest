"use client"

import { useEffect, useState } from "react";

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


import { UserFormSchema } from "../models/users.form.schema"
import { updateUserByIdService } from "../services/users.service"

//import { AppUser } from "@prisma/client";
import { User } from '@/app/modules/settings/users/models/users.interface'

import { revalidateAndRedirectUrl } from "@/lib/revalidate-path";

export default function EditFormUser({
    user
}: {
    user: User
}) {

    const form = useForm<z.infer<typeof UserFormSchema>>({
        resolver: zodResolver(UserFormSchema),
        defaultValues: {
            id: user.id,
            email: user.email,
            name: user.username,
            primaryRole: user.primaryRole
        }
    })

    const {
        formState: { isDirty, isSubmitting },
    } = form;



    async function onSubmit(data: z.infer<typeof UserFormSchema>) {
        await updateUserByIdService(user.id, data);
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
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Id</FormLabel>
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="user@email.com"
                                        {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
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
                            name="primaryRole"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primary Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={user.primaryRole}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select employee label" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}

                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        This is used as as sub-category{" "}
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
                            <Button disabled={isSubmitting || !isDirty} type="submit">Save</Button>
                        </div>
                    </form>
                </Form>

            </CardContent>
        </Card>

    )
}
