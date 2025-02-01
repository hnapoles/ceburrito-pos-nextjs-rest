import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const UserFormSchema = z.object({
  id: z.string(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),
  username: z
    .string()
    .min(6, {
      message: "User name must be at least 6 characters.",
    })
    .max(30, {
      message: "User name must not be longer than 30 characters.",
    }),
  primaryRole: z.string({
      required_error: "Please select a primary role.",
  }),
});


export const NewUserFormSchema = z.object({
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
  