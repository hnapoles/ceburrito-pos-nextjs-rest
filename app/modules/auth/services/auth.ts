import NextAuth, { type User as NextAuthUser }  from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/app/modules//auth/config/auth.config';
import { z } from 'zod';

import { apiRequest } from '@/lib/axios-client';

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
            const user = await apiRequest<IUserResponse>({
              url: LOGIN_URL,
              method: 'POST',
              data: { email, password },
            });
            if (user) {
              return user  
            } 
            return null
          } catch (err) {
            console.log('error during login ', err);
            return null
          }

        }
        

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});