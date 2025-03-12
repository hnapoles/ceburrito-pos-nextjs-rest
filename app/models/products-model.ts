import { z } from 'zod';
import { Lookup } from './lookups-model';

export const ProductZodSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectID (can be omitted)
  name: z
    .string()
    .min(6, 'Name must be at least 6 characters')
    .max(32, 'Name must not exceed 32 characters'),
  description: z
    .string()
    .min(6, 'Description must be at least 6 characters')
    .max(64, 'Description must not exceed 64 characters'),
  type: z.string().optional(),
  category: z
    .string()
    .min(3, 'Category must be at least 3 characters')
    .max(32, 'Category must not exceed 32 characters'),
  basePrice: z.coerce
    .number()
    .min(0.01, 'Price must be at least 0.01')
    .max(1000000, 'Price cannot exceed 1,000,000')
    .multipleOf(0.01, 'Price must be a valid decimal with two places'),
  isSellable: z.boolean().default(true).optional(),
  isOutOfStock: z.boolean().default(false).optional(),
  status: z
    .string()
    .min(3, 'Status must be at least 3 characters')
    .max(32, 'Status must not exceed 32 characters'),
  activeAt: z.string().datetime().optional(), // ISO 8601 format expected
  disabledAt: z.string().datetime().optional(),
  archivedAt: z.string().datetime().optional(),
  imageUrl: z.string().optional(),
  sizeOptions: z.array(z.string()).optional(),
  spiceOptions: z.array(z.string()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  imageFile: z
    .instanceof(File, { message: 'A valid file is required' })
    .refine(
      (file) =>
        ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
          file.type,
        ),
      {
        message: 'Only PNG, JPG, and JPEG files are allowed',
      },
    )
    .refine((file) => file.size < 5 * 1024 * 1024, {
      // 5MB limit
      message: 'File size must be less than 5MB',
    })
    .optional(),
});

export type ProductBase = z.infer<typeof ProductZodSchema>;

export type ProductBaseForCart = ProductBase & {
  cartQty?: number;
  cartUnitPrice?: number;
  cartAmt?: number;
  cartSizeOption?: string;
  cartSpiceOption?: string;
};

export interface ProductForPos extends ProductBase {
  sellingPrices: [];
}

export interface FindProductsOutput {
  count: number;
  data: ProductBase[];
}

export interface ProductsListProps {
  products: ProductBase[];
  limit: number | 10;
  page: number | 1;
  totalDataCount: number | 1;
  statusesLookup: Lookup[];
}

export const ProductSellingPriceZodSchema = z.object({
  _id: z.string().optional(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  orderType: z
    .string()
    .min(3, {
      message: 'Order type must be at least 3 characters.',
    })
    .max(24, {
      message: 'Order type must not be longer than 24 characters.',
    }),
  storeId: z.string().optional(),
  storeName: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  size: z.string().optional(),
  sellingPrice: z.coerce
    .number()
    .min(0.01, 'Selling Price must be at least 0.01')
    .max(1000000, 'Selling Price cannot exceed 1,000,000')
    .multipleOf(0.01, 'Selling Price must be a valid decimal with two places')
    .optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type ProductSellingPriceBase = z.infer<
  typeof ProductSellingPriceZodSchema
>;

export interface FindProductSellingPricesOutput {
  count: number;
  data: ProductSellingPriceBase[];
}
