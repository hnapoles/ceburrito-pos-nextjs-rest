import { z } from 'zod';

export const OrderZodSchema = z.object({
  _id: z.string().optional(), // MongoDB ObjectID (can be omitted)
  type: z
    .string()
    .min(3, 'Category must be at least 3 characters')
    .max(32, 'Category must not exceed 32 characters')
    .optional(),
  customerName: z
    .string()
    .min(6, 'Name must be at least 6 characters')
    .max(64, 'Name must not exceed 64 characters')
    .optional(),
  description: z.string().optional(),
  totalAmount: z.coerce
    .number()
    .min(0.01, 'Amount must be at least 0.01')
    .max(1000000, 'Amount cannot exceed 1,000,000')
    .multipleOf(0.01, 'Amount must be a valid decimal with two places')
    .optional(), // Allows undefined
  status: z
    .string()
    .min(3, 'Status must be at least 3 characters')
    .max(32, 'Status must not exceed 32 characters'),
  orderedAt: z.string().datetime().optional(), // ISO 8601 format expected
  closedAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().optional(),
  archivedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type OrderBase = z.infer<typeof OrderZodSchema>;

export interface FindOrdersOutput {
  count: number;
  data: OrderBase[];
}
