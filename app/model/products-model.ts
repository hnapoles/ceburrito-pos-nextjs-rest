import { z } from "zod"

export interface IProduct {
    _id: string,
    name: string,
    description: string,
    imageUrl?: string | null
    createdAt: Date,
    updatedAt: Date,
    createdBy: string,
    updatedBy: string,
}

export interface IProductListProps {
    products: IProduct[],
    limit: number | 10,
    page: number | 1,
    totalDataCount: number | 1
}

export const NewProductZodSchema = z.object({
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
    category: z.string({
        required_error: "Please select a category.",
    }),
});
  