import { z } from "zod"


export const ZodSchemaCustomer = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(6, {
      message: "Name must be at least 6 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  imageUrl: z
    .string().optional(),
  customerAddress: z
    .string().optional(),
  createdBy: z
    .string().optional(),
  createdAt: z
    .date().optional(),
  updatedBy: z
    .string().optional(),
  updatedAt: z
    .date().optional(),
});

export type CustomerData = z.infer<typeof ZodSchemaCustomer>;