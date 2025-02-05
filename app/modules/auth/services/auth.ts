import NextAuth, { type User as NextAuthUser }  from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/app/modules//auth/config/auth.config';
import { z } from 'zod';

import { apiRequest } from '@/lib/axios-client';
import axios from "axios";


import { IUserResponse } from '../../settings/users/models/users-models';

const LOGIN_URL = process.env.LOGIN_URL || "http://172.104.117.139:3000/auth/login";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          try {
            const response = await axios.post(LOGIN_URL, {
              email, password
            });
  
            if (response.status === 200 && response.data) {
              return response.data; // Assuming API returns user data on success
            } else {
              return null; // Invalid credentials
            }
          } catch (error: any) {
            if (error.response) {
              // Handle API response errors like 401, 403, 500
              console.error("API Error:", error.response.data);
              throw new Error(error.response.data.message || "Invalid credentials");
            } else if (error.request) {
              // Handle no response from server
              console.error("No Response from API:", error.request);
              throw new Error("No response from authentication server");
            } else {
              // Other unexpected errors
              console.error("Unexpected Error:", error.message);
              throw new Error("An unexpected error occurred");
            }
          }

         

        }
        

        
      },
    }),
  ],
});