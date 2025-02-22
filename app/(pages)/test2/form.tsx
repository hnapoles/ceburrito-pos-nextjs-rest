'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ProductFormProps {
  initialData?: {
    name: string;
    description: string;
    price: number;
    status: string;
    imageUrl: string;
    orderOptions: {
      sizeOption: 'S' | 'M' | 'L';
      sizeAffectPricing: boolean;
      spiceOption: 'mild' | 'regular' | 'super spicy';
      spiceAffectPricing: boolean;
    };
  };
  onSubmit: (data: any) => void;
}

export default function ProductForm({
  initialData,
  onSubmit,
}: ProductFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      status: 'active',
      imageUrl: '',
      orderOptions: {
        sizeOption: 'M',
        sizeAffectPricing: false,
        spiceOption: 'regular',
        spiceAffectPricing: false,
      },
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    // Replace with your actual file upload API endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const { imageUrl } = await response.json();
      setValue('imageUrl', imageUrl);
      setImagePreview(imageUrl);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Product' : 'Insert Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <Label>Name</Label>
            <Input
              {...register('name')}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <Label>Description</Label>
            <Textarea
              {...register('description')}
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Price Input */}
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              step="0.01"
              {...register('price')}
              placeholder="Enter product price"
              required
            />
          </div>

          {/* Status Select */}
          <div>
            <Label>Status</Label>
            <Select
              onValueChange={(value) => setValue('status', value)}
              defaultValue={watch('status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Order Options - Size */}
          <div>
            <Label>Size Option</Label>
            <Select
              onValueChange={(value) =>
                setValue('orderOptions.sizeOption', value)
              }
              defaultValue={watch('orderOptions.sizeOption')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S">Small (S)</SelectItem>
                <SelectItem value="M">Medium (M)</SelectItem>
                <SelectItem value="L">Large (L)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Affect Pricing for Size */}
          <div className="flex items-center justify-between">
            <Label>Affect Pricing (Size)</Label>
            <Switch
              checked={watch('orderOptions.sizeAffectPricing')}
              onCheckedChange={(checked) =>
                setValue('orderOptions.sizeAffectPricing', checked)
              }
            />
          </div>

          {/* Order Options - Spice */}
          <div>
            <Label>Spice Option</Label>
            <Select
              onValueChange={(value) =>
                setValue('orderOptions.spiceOption', value)
              }
              defaultValue={watch('orderOptions.spiceOption')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select spice level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="super spicy">Super Spicy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Affect Pricing for Spice */}
          <div className="flex items-center justify-between">
            <Label>Affect Pricing (Spice)</Label>
            <Switch
              checked={watch('orderOptions.spiceAffectPricing')}
              onCheckedChange={(checked) =>
                setValue('orderOptions.spiceAffectPricing', checked)
              }
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileUpload} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-auto rounded-lg"
              />
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit">
            {initialData ? 'Update' : 'Insert'} Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
