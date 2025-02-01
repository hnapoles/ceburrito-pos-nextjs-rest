import NextAuth, { type User as NextAuthUser }  from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/app/modules//auth/config/auth.config';
import { z } from 'zod';
//import { compare } from 'bcrypt-ts';

import { postApi } from '@/lib/api-utils';

type LoginResponse = {
  success: boolean,
  messsage: string,
  data: {
      id: string,
      username: string,
      email: string,
      primaryRole: string
      accessToken: string
  }
}

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
          
          const { data: response, error, status } = await postApi<LoginResponse>(LOGIN_URL, {email, password} )
        
          console.log('auth server error ', error)
          //console.log('new data', response);

          if (!response || !response.data || error) return null;
          /*
          const passwordsMatch = await compare(password, user.password);
          if (!passwordsMatch) {
            return null
          }
          */
          const { data: user } = response;

          const userData = {
            id: user.id,
            email: user.email,
            name: user.username,
            primaryRole: user.primaryRole,
            accessToken: user.accessToken
          } 
  
          console.log('user data ', userData);
          return userData;
        }
        
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});