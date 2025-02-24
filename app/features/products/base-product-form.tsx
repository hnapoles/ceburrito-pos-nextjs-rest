'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

import { Separator } from '@/components/ui/separator';
import { ProductBase, ProductZodSchema } from '@/app/models/products-model';
import { Lookup } from '@/app/models/lookups-model';

interface baseProductFormProps {
  initialData?: ProductBase;
  categories: Lookup[];
  statuses: Lookup[];
  onSubmit: (data: any) => void;
}

export default function BaseProductForm({
  initialData,
  categories,
  statuses,
  onSubmit,
}: baseProductFormProps) {
  const router = useRouter();

  const form = useForm<ProductBase>({
    resolver: zodResolver(ProductZodSchema),
    defaultValues: initialData || {
      _id: '',
      name: '',
      description: '',
      basePrice: undefined,
      status: 'draft',
      imageUrl: '',
      sizeOptions: [],
      spiceOptions: [],
    },
    mode: 'onBlur',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty, isSubmitting },
  } = form;

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

  //
  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Product' : 'New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* form details */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:space-y-3 space-y-1"
          >
            {initialData && (
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
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter product name"
                    {...field}
                  />

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
                  <Textarea
                    placeholder="Enter product description"
                    {...field}
                  />

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

            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    step="0.01" // Allows decimals
                    placeholder=""
                    value={field.value ?? ''} // Ensures the input field shows empty when undefined
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow empty input (user deletes the value)
                      if (value === '') {
                        field.onChange(undefined); // Pass undefined instead of an empty string
                        return;
                      }

                      // Convert input to a valid number
                      const numericValue = parseFloat(value);

                      if (!isNaN(numericValue)) {
                        field.onChange(numericValue); // Ensure a number is passed
                      }
                    }}
                    onBlur={() => {
                      if (field.value !== undefined && !isNaN(field.value)) {
                        field.onChange(parseFloat(field.value.toFixed(2))); // Maintain numeric type
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    {...field}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((l) => (
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

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? 'Submitting...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
        {/* end - form details */}
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
