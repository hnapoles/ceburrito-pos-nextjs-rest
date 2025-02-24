'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Separator } from '@/components/ui/separator';

interface BaseProductFormProps {
  initialData?: {
    name: string;
    description: string;
    price: number;
    status: string;
    imageUrl?: string;
    orderOptions: {
      sizeOption: string[];
      sizeAffectPricing: boolean;
      spiceOption: 'mild' | 'regular' | 'super spicy';
      spiceAffectPricing: boolean;
    };
  };
  onSubmit: (data: any) => void;
}

export default function BaseProductForm({
  initialData,
  onSubmit,
}: BaseProductFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      status: 'active',
      imageUrl: '',
      orderOptions: {
        sizeOption: [],
        sizeAffectPricing: false,
        spiceOption: 'regular',
        spiceAffectPricing: false,
      },
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [showDialog, setShowDialog] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    /*
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const { imageUrl } = await response.json();
      setValue('imageUrl', imageUrl);
      setImagePreview(imageUrl);
    }
    */
    if (true) {
      const imageUrl = 'http://localhost:3000/images/products/heart.png';
      setValue('imageUrl', imageUrl);
      setImagePreview(imageUrl);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowDialog(true); // Show confirmation modal if form is dirty
    } else {
      router.back(); // If no changes, navigate back
    }
  };

  const discardChanges = () => {
    setShowDialog(false);
    router.back();
  };

  const sizeOptions = ['S', 'M', 'L', 'XL'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Product' : 'Insert Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              {...register('name')}
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              {...register('description')}
              placeholder="Enter product description"
              required
            />
          </div>

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

          <div>
            <Label>Status</Label>
            <select
              {...register('status')}
              defaultValue={watch('status')}
              className="border rounded p-2 w-full"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <Label>Image</Label>
            {imagePreview ? (
              <div className="relative w-full cursor-pointer">
                <img
                  src={imagePreview}
                  alt="Product Image"
                  className="mt-2 w-full h-auto rounded-lg"
                  onClick={() => {
                    setImagePreview(null);
                    setValue('imageUrl', '');
                  }}
                />
              </div>
            ) : (
              <Input type="file" accept="image/*" onChange={handleFileUpload} />
            )}
          </div>

          {/*
          <div>
            <Separator />
            <Label>Order Options:</Label>
            <Separator />
            <Label>Sizes</Label>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => (
                <label key={size} className="flex items-center gap-2">
                  <Checkbox
                    checked={watch('orderOptions.sizeOption').includes(size)}
                    onCheckedChange={(checked) => {
                      const currentSizes =
                        watch('orderOptions.sizeOption') || [];
                      setValue(
                        'orderOptions.sizeOption',
                        checked
                          ? [...currentSizes, size]
                          : currentSizes.filter((s: string) => s !== size),
                      );
                    }}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>
          */}
          <div>
            <Separator />
            <Label>Order Options:</Label>
            <div className="ml-4 mt-2">
              <Label>Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <label key={size} className="flex items-center gap-2">
                    <Checkbox
                      checked={watch('orderOptions.sizeOption').includes(size)}
                      onCheckedChange={(checked) => {
                        const currentSizes =
                          watch('orderOptions.sizeOption') || [];
                        setValue(
                          'orderOptions.sizeOption',
                          checked
                            ? [...currentSizes, size]
                            : currentSizes.filter((s: string) => s !== size),
                        );
                      }}
                    />
                    {size}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Checkbox {...register('orderOptions.sizeAffectPricing')} />
                <Label>Size Affects Pricing</Label>
              </div>
              <div className="mt-4">
                <Label>Spice Options</Label>
                <select
                  {...register('orderOptions.spiceOption')}
                  defaultValue={watch('orderOptions.spiceOption')}
                  className="border rounded p-2 w-full"
                >
                  <option value="mild">Mild</option>
                  <option value="regular">Regular</option>
                  <option value="super spicy">Super Spicy</option>
                </select>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Checkbox {...register('orderOptions.spiceAffectPricing')} />
                <Label>Spice Affects Pricing</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Insert'} Product
            </Button>
          </div>
        </form>
      </CardContent>

      {/* Discard Changes Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard Changes?</DialogTitle>
          </DialogHeader>
          <p>
            You have unsaved changes. Are you sure you want to discard them?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              No, Keep Editing
            </Button>
            <Button variant="destructive" onClick={discardChanges}>
              Yes, Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
