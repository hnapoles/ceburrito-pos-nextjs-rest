import { z } from "zod"

export interface IUserResponse {
    id: string,
    username: string,
    email: string,
    primaryRole: string
    isVerified: boolean,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    createdBy: string,
    updatedBy: string,
    imageUrl?: string | null,
    accessToken?: string | null,
    apiKey?: string | null,
    provider?: string | null,
}


export const NewUserZodSchema = z.object({
    email: z
      .string({
        required_error: "Please enter valid email address.",
      })
      .email(),
    username: z
      .string()
      .min(6, {
        message: "User name must be at least 6 characters.",
      })
      .max(30, {
        message: "User name must not be longer than 30 characters.",
      }),
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .max(30, {
        message: "User name must not be longer than 30 characters.",
      }),
    primaryRole: z.string({
        required_error: "Please select a primary role.",
    }),
});

export interface IUserWho {
  createdAt?: Date,
  updatedAt?: Date,
  createdBy?: string,
  updatedBy?: string,
}

