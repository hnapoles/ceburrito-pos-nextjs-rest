'use client';

import { z } from 'zod';

// Define different attribute types
const ClothingAttributesSchema = z.object({
  type: z.literal('clothing'),
  color: z.string().min(1, 'Color is required'),
  size: z.enum(['S', 'M', 'L', 'XL']),
});

const ElectronicsAttributesSchema = z.object({
  type: z.literal('electronics'),
  brand: z.string().min(1, 'Brand is required'),
  warranty: z.boolean(),
  weight: z.number().positive('Weight must be a positive number'),
});

const FoodAttributesSchema = z.object({
  type: z.literal('food'),
  expirationDate: z.string().min(1, 'Expiration date is required'),
  isOrganic: z.boolean(),
});

// Dynamic attribute schema
const ProductAttributesSchema = z.array(
  z.discriminatedUnion('type', [
    ClothingAttributesSchema,
    ElectronicsAttributesSchema,
    FoodAttributesSchema,
  ]),
);

// Full Product Schema
const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  inStock: z.boolean(),
  attributes: ProductAttributesSchema,
});

// TypeScript Types
type ProductFormType = z.infer<typeof ProductSchema>;

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
//import { ProductSchema, ProductFormType } from "@/lib/validations/product-schema";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

const attributeOptions = [
  { label: 'Clothing', value: 'clothing' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Food', value: 'food' },
];

export default function ProductForm() {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      inStock: true,
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });

  const onSubmit = (data: ProductFormType) => {
    console.log('Form Data:', data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-lg mx-auto p-4"
    >
      {/* Product Name */}
      <Label>Product Name</Label>
      <Input {...register('name')} placeholder="Enter product name" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      {/* Category */}
      <Label>Category</Label>
      <Input {...register('category')} placeholder="Enter category" />
      {errors.category && (
        <p className="text-red-500">{errors.category.message}</p>
      )}

      {/* Price */}
      <Label>Price</Label>
      <Input type="number" {...register('price', { valueAsNumber: true })} />
      {errors.price && <p className="text-red-500">{errors.price.message}</p>}

      {/* In Stock */}
      <Label className="flex items-center gap-2">
        <Checkbox {...register('inStock')} />
        In Stock
      </Label>

      {/* Dynamic Attributes */}
      <Label>Attributes</Label>
      {fields.map((field, index) => {
        const type = watch(`attributes.${index}.type`);

        return (
          <Card key={field.id} className="p-4 border border-gray-300">
            <CardContent className="space-y-2">
              {/* Attribute Type */}
              <Controller
                control={control}
                name={`attributes.${index}.type`}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      {field.value || 'Select Attribute Type'}
                    </SelectTrigger>
                    <SelectContent>
                      {attributeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Conditional Fields Based on Type */}
              {type === 'clothing' && (
                <>
                  <Label>Color</Label>
                  <Input
                    {...register(`attributes.${index}.color`)}
                    placeholder="Enter color"
                  />
                  <Label>Size</Label>
                  <Controller
                    control={control}
                    name={`attributes.${index}.size`}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          {field.value || 'Select Size'}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </>
              )}

              {type === 'electronics' && (
                <>
                  <Label>Brand</Label>
                  <Input
                    {...register(`attributes.${index}.brand`)}
                    placeholder="Enter brand"
                  />
                  <Label>Warranty</Label>
                  <Controller
                    control={control}
                    name={`attributes.${index}.warranty`}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    {...register(`attributes.${index}.weight`, {
                      valueAsNumber: true,
                    })}
                  />
                </>
              )}

              {type === 'food' && (
                <>
                  <Label>Expiration Date</Label>
                  <Input
                    type="date"
                    {...register(`attributes.${index}.expirationDate`)}
                  />
                  <Label className="flex items-center gap-2">
                    <Checkbox {...register(`attributes.${index}.isOrganic`)} />
                    Organic
                  </Label>
                </>
              )}

              {/* Remove Attribute Button */}
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <Button type="button" onClick={() => append({ type: '' })}>
        Add Attribute
      </Button>

      {/* Submit Button */}
      <Button type="submit">Submit</Button>
    </form>
  );
}
