import { z } from 'zod';

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
  status: z
    .string()
    .min(3, 'Status must be at least 3 characters')
    .max(32, 'Status must not exceed 32 characters'),
  activeAt: z.string().datetime().optional(), // ISO 8601 format expected
  disabledAt: z.string().datetime().optional(),
  imageUrl: z.string().optional(),
  sizeOptions: z.array(z.string()).optional(),
  spiceOptions: z.array(z.string()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type ProductDataBase = z.infer<typeof ProductZodSchema>;

export interface FindProductsOutput {
  count: number;
  data: ProductDataBase[];
}

export interface ProductsListProps {
  products: ProductDataBase[];
  limit: number | 10;
  page: number | 1;
  totalDataCount: number | 1;
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

export type ProductSellingPriceDataBase = z.infer<
  typeof ProductSellingPriceZodSchema
>;

export interface FindProductSellingPricesOutput {
  count: number;
  data: ProductSellingPriceDataBase[];
}
