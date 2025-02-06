'use server';

import { signIn } from '@/app/modules/auth/services/auth';
import { AuthError } from 'next-auth';

import { SignInResponse } from "next-auth/react";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {

  await signIn('credentials', formData);
  

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      console.log('error instance of ', error)
      console.log('error instance of type ', error.type)
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    } 
    throw error;
    //return 'Server error'
  }
    

}