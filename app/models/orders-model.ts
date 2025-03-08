import { z } from 'zod';

export const OrderLineZodSchema = z.object({
  productId: z.string().min(3, 'Product ID is required'),
  productName: z.string().min(3, 'Product name is required'),
  imageUrl: z.string().optional(),
  sizeOption: z.string().optional(),
  spiceOption: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(1, 'Price must be at least 1'),
  amount: z.number().min(1, 'Price must be at least 1'),
  status: z.string().optional(),
});

export type OrderLineBase = z.infer<typeof OrderLineZodSchema>;

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
  customerId: z
    .string()
    .min(6, 'Id must be at least 6 characters')
    .max(64, 'Id must not exceed 64 characters')
    .optional(),
  customerEmail: z.string().email().optional(),
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
  mode: z
    .string()
    .min(3, 'Mode must be at least 3 characters')
    .max(32, 'Mode must not exceed 32 characters')
    .optional(), //dine-in, takeout, store-pickup, delivery
  paymentMethod: z
    .string()
    .min(3, 'Payment method must be at least 3 characters')
    .max(32, 'Payment method must not exceed 32 characters')
    .optional(), //cash, card, Gcash
  paymentReference: z
    .string()
    .min(3, 'Reference must be at least 3 characters')
    .max(64, 'Reference must not exceed 64 characters')
    .optional(),
  storeName: z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(32, 'Must not exceed 32 characters')
    .optional(),
  orderedAt: z.string().datetime().optional(), // ISO 8601 format expected
  closedAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().optional(),
  archivedAt: z.string().datetime().optional(),
  orderLines: z.array(OrderLineZodSchema).optional(),
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

/*
type OrderLine struct {
	ProductId   primitive.ObjectID `bson:"productId" json:"productId" validate:"required"`
	ProductName string             `bson:"productName" json:"productName" validate:"required,min=6,max=32"`
	Quantity    float64            `bson:"quantity" json:"quantity" validate:"required,gt=0"`
	UnitCost    float64            `json:"unitCost" bson:"unitCost" validate:"required,gt=0"`
}
*/
