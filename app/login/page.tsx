'use client';

//import { GoogleSignIn } from "./google-signin"
import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from '@/components/ui/card-rounded-sm';

import { Button } from '@/components/ui/button-rounded-sm';

export default function SignIn() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'; // Default redirect

  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl });
    setLoading(false);
  };

  return (
    <form action={handleSignIn}>
      <Card className="flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8">
        {' '}
        {/*className="mx-auto max-w-sm">*/}
        <CardHeader>
          <div className="grid justify-center place-items-center p-1">
            <Image
              src="/logos/3.png"
              width={100}
              height={20}
              className="md-block"
              alt="Ceburrito.ph"
              priority
            />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          {/*<CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            */}
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" type="submit">
            <Image
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              width={20}
              height={20}
            />
            {loading ? 'Signing in...' : 'Log in with Google'}
          </Button>
        </CardContent>
        <CardFooter className="w-[350px]">
          <CardDescription>
            By clicking continue, you agree to our Terms of Service and Privacy
            Policy.
          </CardDescription>
        </CardFooter>
      </Card>
    </form>
  );
};
