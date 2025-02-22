import { z } from 'zod';

export const ZodSchemaProduct = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(6, {
      message: 'Name must be at least 6 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    }),
  description: z
    .string()
    .min(6, {
      message: 'Description must be at least 6 characters.',
    })
    .max(60, {
      message: 'Description must not be longer than 60 characters.',
    }),
  imageUrl: z.string().optional(),
  price: z.coerce
    .number()
    .min(0.01, 'Price must be at least 0.01')
    .max(1000000, 'Price cannot exceed 1,000,000')
    .multipleOf(0.01, 'Price must be a valid decimal with two places'),
  type: z.string().optional(),
  status: z.string().optional(),
  category: z.string({
    required_error: 'Please select a product category.',
  }),
  createdBy: z.string().optional(),
  createdAt: z.date().optional(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});
export type ProductData = z.infer<typeof ZodSchemaProduct>;

export interface IGetProductsResults {
  count: number;
  data: ProductData[];
}

export interface IProductListProps {
  products: ProductData[];
  limit: number | 10;
  page: number | 1;
  totalDataCount: number | 1;
}

export const ZodSchemaProductSellingPrices = z.object({
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
  sellingPrice: z.coerce
    .number()
    .min(0.01, 'Selling Price must be at least 0.01')
    .max(1000000, 'Selling Price cannot exceed 1,000,000')
    .multipleOf(0.01, 'Selling Price must be a valid decimal with two places')
    .optional(),
  createdBy: z.string().optional(),
  createdAt: z.date().optional(),
  updatedBy: z.string().optional(),
  updatedAt: z.date().optional(),
});

export type ProductSellingPricesData = z.infer<
  typeof ZodSchemaProductSellingPrices
>;

export interface IGetProductSellingPricesResults {
  count: number;
  data: ProductSellingPricesData[];
}
