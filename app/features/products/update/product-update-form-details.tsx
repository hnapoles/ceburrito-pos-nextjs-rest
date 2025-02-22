'use client';
import React from 'react';

//import Image from "next/image";
//import { cn } from "@/lib/utils"

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { revalidateAndRedirectUrl } from '@/lib/revalidate-path';

import { ZodSchemaProduct, ProductData } from '@/app/model/products-model';
import { Lookup } from '@/app/model/lookups-model';
import { UpdateProduct } from '@/app/action/server/products-actions';

import { useGlobalStore } from '@/app/provider/zustand-provider';

export default function ProductUpdateFormDetails({
  types,
  categories,
  imageUrl,
}: {
  types: Lookup[];
  categories: Lookup[];
  imageUrl: string | null;
}) {
  const product = useGlobalStore((state) => state.product);

  let defaultValues: ProductData = {
    _id: product?._id || '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0.0,
    type: product?.type || '',
    category: product?.category ?? '',
    imageUrl: product?.imageUrl ?? '',
  };

  if (product) {
    defaultValues = {
      _id: product?._id || '',
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price ?? 0.0,
      type: product?.type || '',
      category: product?.category ?? '',
      imageUrl: product?.imageUrl ?? '',
    };
  }

  const form = useForm<ProductData>({
    resolver: zodResolver(ZodSchemaProduct),
    defaultValues: defaultValues,
    mode: 'onBlur',
  });

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
      isSubmitting,
    },
  } = form;

  async function onSubmit(data: ProductData) {
    console.log('create form data');
    console.log(data);
    data = {
      ...data,
      imageUrl: imageUrl ?? '',
    };
    const productUpdated = await UpdateProduct(data);

    toast({
      title: 'Data saved for user',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(productUpdated, null, 2)}
          </code>
        </pre>
      ),
    });
    revalidateAndRedirectUrl('/dashboard/products');
  }

  if (product && product.name) {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:space-y-3 space-y-1"
        >
          <FormField
            control={form.control}
            name="_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Id</FormLabel>
                <Input placeholder="" readOnly {...field} />
                <FormDescription>
                  This is a system generated id .
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
                <Input type="text" placeholder="" {...field} />

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
                <Input type="text" placeholder="" {...field} />

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
                  step="0.01" // Allows decimals
                  placeholder="0.00"
                  value={field.value ? Number(field.value).toFixed(2) : ''}
                  onChange={(e) => {
                    const value = e.target.value; // Always a string from input
                    const numericValue = parseFloat(value);

                    // Ensure valid numeric input
                    if (!isNaN(numericValue)) {
                      field.onChange(numericValue.toFixed(2)); // Pass as string
                    } else {
                      field.onChange(''); // Handle empty input
                    }
                  }}
                />
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
                <Select
                  onValueChange={field.onChange}
                  {...field}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {types.map((l) => (
                      <SelectItem key={l.lookupValue} value={l.lookupValue}>
                        {l.lookupDescription}
                      </SelectItem>
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
                <Select
                  onValueChange={field.onChange}
                  {...field}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((l) => (
                      <SelectItem key={l.lookupValue} value={l.lookupValue}>
                        {l.lookupDescription}{' '}
                      </SelectItem>
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
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    );
  }
}
