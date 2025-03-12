'use client';
import { useState, useRef, ChangeEvent, useEffect } from 'react';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button-rounded-sm';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
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

import { IsUserPermissionLevelAllowed } from '@/app/actions/server/permissions-actions';

interface baseProductFormProps {
  initialData?: ProductBase;
  categories: Lookup[];
  statuses: Lookup[];
  sizes: Lookup[];
  spices: Lookup[];
  onSubmit: (data: ProductBase) => void;
  isViewOnly?: boolean;
}

export default function BaseProductForm({
  initialData,
  categories,
  statuses,
  sizes,
  spices,
  onSubmit,
  isViewOnly = true,
}: baseProductFormProps) {
  const router = useRouter();

  const [isEditAllowed, setIsEditAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAccess() {
      const allowed = await IsUserPermissionLevelAllowed('admin'); // ✅ Await the result
      setIsEditAllowed(allowed);
    }

    checkAccess();
  }, []);

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
      posDisplaySeq: 1,
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
      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
      ]; // ✅ Allow WebP

      const MAX_FILE_SIZE = 1 * 1024 * 1024; // MB

      if (!allowedTypes.includes(file.type)) {
        alert('Only PNG, JPEG, JPG, and WEBP formats are allowed.');
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Maximum size is 1MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageButtonClick = () => {
    if (isViewOnly) return;
    fileInputRef.current?.click();
  };

  /*
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  */
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true); // Show confirmation modal if form is dirty
    } else {
      router.back(); // If no changes, navigate back
    }
  };

  const discardChanges = () => {
    setShowCancelDialog(false);
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
        <CardTitle>
          {' '}
          {isViewOnly
            ? 'View Product'
            : initialData
            ? 'Edit Product'
            : 'New Product'}
        </CardTitle>
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
                  priority
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
                      accept="image/png, image/jpeg, image/jpg, image/webp"
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
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-32">Id</FormLabel>
                    <Input
                      placeholder=""
                      readOnly
                      {...field}
                      className="bg-gray-100 border-none"
                    />
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
                <FormItem className="w-full flex flex-col">
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-32">Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter product name"
                      readOnly={isViewOnly}
                      className={cn(
                        isViewOnly
                          ? 'bg-gray-50 border-none' // ✅ Force styles for disabled input
                          : '',
                      )}
                      {...field}
                    />
                  </div>
                  <FormMessage className="ml-auto" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-32">Description</FormLabel>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                      readOnly={isViewOnly}
                      className={cn(
                        isViewOnly
                          ? 'bg-gray-50 border-none' // ✅ Force styles for disabled input
                          : '',
                      )}
                    />
                  </div>

                  <FormMessage className="ml-auto" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel className="w-32">Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    {...field}
                    value={field.value || ''}
                    disabled={isViewOnly}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          isViewOnly
                            ? 'disabled:opacity-90 disabled:bg-gray-50 disabled:border-none'
                            : '',
                        )}
                      >
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
                  <FormLabel className="w-32">Base Price</FormLabel>
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
                <FormItem className="w-full flex flex-col">
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-32">Base Price</FormLabel>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder=""
                      {...field}
                      readOnly={isViewOnly}
                      className={cn(
                        isViewOnly
                          ? 'bg-gray-50 border-none' // ✅ Force styles for disabled input
                          : '',
                      )}
                    />
                  </div>
                  <FormMessage className="ml-auto" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sizeOptions"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel className="w-32">Size Options</FormLabel>
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
                              disabled={isViewOnly}
                              className={cn(
                                isViewOnly ? 'disabled:opacity-100' : '',
                              )}
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
                <FormItem className="flex items-center gap-4">
                  <FormLabel className="w-32">Spice Options</FormLabel>
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
                              disabled={isViewOnly}
                              className={cn(
                                isViewOnly ? 'disabled:opacity-100' : '',
                              )}
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
                    disabled={isViewOnly}
                    className={cn(isViewOnly ? 'disabled:opacity-100' : '')}
                  />
                  <FormLabel className="w-32">Sellable?</FormLabel>
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
                    disabled={isViewOnly}
                    className={cn(isViewOnly ? 'disabled:opacity-100' : '')}
                  />
                  <FormLabel className="w-32">Out of Stock?</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="posDisplaySeq"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col">
                  <div className="flex items-center gap-4">
                    <FormLabel className="w-32">POS Display Seq</FormLabel>
                    <Input
                      type="number"
                      placeholder=""
                      {...field}
                      readOnly={isViewOnly}
                      className={cn(
                        isViewOnly
                          ? 'bg-gray-50 border-none' // ✅ Force styles for disabled input
                          : '',
                      )}
                    />
                  </div>
                  <FormMessage className="ml-auto" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center gap-4">
                  <FormLabel className="w-32">Status</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleStatusChange(value); // Call the onChange handler
                    }}
                    {...field}
                    value={field.value || ''}
                    disabled={isViewOnly}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={cn(
                          isViewOnly
                            ? 'disabled:opacity-90 disabled:bg-gray-50 disabled:border-none'
                            : '',
                        )}
                      >
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

            {isViewOnly && isEditAllowed && (
              <div className="flex justify-end pt-2 md:pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(`/products/${initialData?._id || ''}/edit`)
                  }
                >
                  Edit
                </Button>
              </div>
            )}
            {!isViewOnly && isEditAllowed && (
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
            )}
          </form>
        </Form>
        {/* end - form details */}
      </CardContent>

      {/* Discard Changes Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard Changes?</DialogTitle>
          </DialogHeader>
          <p>
            You have unsaved changes. Are you sure you want to discard them?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
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
