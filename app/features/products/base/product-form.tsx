'use client';
import { useState, useRef, ChangeEvent } from 'react';

import Image from 'next/image';
import { cn } from '@/lib/utils';
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
  //FormDescription,
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

import { Switch } from '@/components/ui/switch';

import { ProductBase, ProductZodSchema } from '@/app/models/products-model';
import { Lookup } from '@/app/models/lookups-model';

interface baseProductFormProps {
  initialData?: ProductBase;
  categories: Lookup[];
  statuses: Lookup[];
  sizes: Lookup[];
  spices: Lookup[];
  onSubmit: (data: any) => void;
}

export default function BaseProductForm({
  initialData,
  categories,
  statuses,
  sizes,
  spices,
  onSubmit,
}: baseProductFormProps) {
  const router = useRouter();

  const form = useForm<ProductBase>({
    resolver: zodResolver(ProductZodSchema),
    defaultValues: initialData || {
      _id: '',
      name: '',
      description: '',
      basePrice: 0,
      status: 'draft',
      imageUrl: '',
      sizeOptions: [],
      spiceOptions: [],
      isOutOfStock: false,
      isSellable: true,
    },
    mode: 'onBlur',
  });

  const {
    setValue,
    formState: { isDirty, isSubmitting, errors },
  } = form;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || undefined;

    setValue('imageFile', file, { shouldDirty: true });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [showDialog, setShowDialog] = useState(false);

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

  // Add the onChange handler to the `status` field
  const handleStatusChange = (status: string) => {
    // If the status is 'active', set activeAt to the current date
    if (status === 'active') {
      setValue('activeAt', new Date().toISOString()); // Store the current date
    }
    if (status === 'disabled') {
      setValue('disabledAt', new Date().toISOString()); // Store the current date
    }
    if (status === 'archived') {
      setValue('archivedAt', new Date().toISOString()); // Store the current date
    }
  };

  const sizeOptions = sizes.map((option) => option.lookupValue);
  const spiceOptions = spices.map((option) => option.lookupValue);
  const imageUrl = initialData?.imageUrl;

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
            <div className="relative">
              <div
                className="flex space-x-4 pb-4 hover:pointer-cursor"
                onClick={handleImageButtonClick}
              >
                <Image
                  src={
                    selectedFile || imageUrl || '/images/products/no-image.jpg'
                  }
                  alt="image"
                  width={100}
                  height={100}
                  className={cn(
                    'h-auto w-auto object-cover transition-all hover:scale-105',
                    'aspect-square',
                  )}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      onBlur={field.onBlur} // Use the onBlur to track blur event
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {initialData && (
              <FormField
                control={form.control}
                name="_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Id</FormLabel>
                    <Input placeholder="" readOnly {...field} />
                    {/*<FormDescription>
                      This is a system generated id
                    </FormDescription>*/}
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

            {/*
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <Input
                    type="number"
                    step="0.01" // Allows decimals
                    placeholder=""
                    value={field.value ?? ''} // Ensures the input field shows empty when undefined
                    onChange={(e) => {
                      const value = e.target.value.trim();

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
                    onFocus={(e) => {
                      // Manually set the cursor position to the end of the input value
                      const value = e.target.value;
                      e.target.value = ''; // This clears the input field
                      e.target.value = value; // This restores the input field value and sets the cursor to the end
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
            */}
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <Input type="number" step="0.01" placeholder="" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sizeOptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size Options</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => {
                      const isChecked = field.value?.includes(size);
                      return (
                        <FormControl key={size}>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), size]
                                  : field.value?.filter((s) => s !== size) ||
                                    [];
                                field.onChange(newValue);
                              }}
                            />
                            <Label>{size}</Label>
                          </div>
                        </FormControl>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spiceOptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spice Options</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {spiceOptions.map((spice) => {
                      const isChecked = field.value?.includes(spice);
                      return (
                        <FormControl key={spice}>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...(field.value || []), spice]
                                  : field.value?.filter((s) => s !== spice) ||
                                    [];
                                field.onChange(newValue);
                              }}
                            />
                            <Label>{spice}</Label>
                          </div>
                        </FormControl>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2"></div>
            <FormField
              control={form.control}
              name="isSellable"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel>Sellable?</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOutOfStock"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel>Out of Stock?</FormLabel>
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleStatusChange(value); // Call the onChange handler
                    }}
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

            <div className="flex justify-between pt-2 md:pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting || !isDirty || Object.keys(errors).length > 0
                }
              >
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
