import { z } from "zod"

export interface IProduct {
    _id: string,
    name: string,
    description: string,
    price: number,
    imageUrl?: string | null
    createdAt: Date,
    updatedAt: Date,
    createdBy: string,
    updatedBy: string,
}

export interface IGetProductsResults {
  count: number,
  data: IProduct[] 
}

export interface IProductListProps {
    products: IProduct[],
    limit: number | 10,
    page: number | 1,
    totalDataCount: number | 1
}

export const ZodSchemaProduct = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(6, {
      message: "Name must be at least 6 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  description: z
    .string()
    .min(6, {
      message: "Description must be at least 6 characters.",
    })
    .max(60, {
      message: "Description must not be longer than 60 characters.",
    }),
  imageUrl: z
    .string().optional(),
  price: z
    .coerce
    .number()
    .min(0.01, "Price must be at least 0.01")
    .max(1000000, "Price cannot exceed 1,000,000")
    .multipleOf(0.01, "Price must be a valid decimal with two places"),
  type: z.string({
      required_error: "Please select a product type",
  }),
  category: z.string({
      required_error: "Please select a product category.",
  }),
  createdBy: z
    .string().optional(),
  createdAt: z
    .date().optional(),
  updatedBy: z
    .string().optional(),
  updatedAt: z
    .date().optional(),
});
export type ProductData = z.infer<typeof ZodSchemaProduct>;

export const ProductCategoryFilter = {
  "andFilter": {
    "lookupGroup": "product",
    "lookupCode" : "category"
  },
  "limit": 999,
  "page": 1,
  "sortOptions": [
    {
      "sortField": "lookupCode",
      "sortOrder": 1
    },
    {
      "sortField": "lookupValue",
      "sortOrder": 1
    }
  ]
}

export const ProductTypeFilter = {
  "andFilter": {
    "lookupGroup": "product",
    "lookupCode" : "type"
  },
  "limit": 999,
  "page": 1,
  "sortOptions": [
    {
      "sortField": "lookupCode",
      "sortOrder": 1
    },
    {
      "sortField": "lookupValue",
      "sortOrder": 1
    }
  ]
}


export const ZodSchemaProductSellingPrices = z.object({
  _id: z.string().optional(),
  productId: z
    .string()
    .min(6, {
      message: "Product id must be at least 6 characters.",
    })
    .max(30, {
      message: "Product id not be longer than 30 characters.",
    }),
  orderType: z
    .string()
    .min(6, {
      message: "Order type must be at least 6 characters.",
    })
    .max(60, {
      message: "Order type must not be longer than 60 characters.",
    }),
  storeId: z
    .string().optional(),
  sellingPrice: z
    .coerce
    .number()
    .min(0.01, "Selling Price must be at least 0.01")
    .max(1000000, "Selling Price cannot exceed 1,000,000")
    .multipleOf(0.01, "Selling Price must be a valid decimal with two places"),
  createdBy: z
    .string().optional(),
  createdAt: z
    .date().optional(),
  updatedBy: z
    .string().optional(),
  updatedAt: z
    .date().optional(),
});
export type ProductSellingPricesData = z.infer<typeof ZodSchemaProductSellingPrices>;