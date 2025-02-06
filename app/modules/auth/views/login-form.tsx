"use client"
import { signIn } from '@/app/modules/auth/services/auth';

import { toast } from "@/hooks/use-toast"

import React, { useState } from "react";

import Link from "next/link"
import Image from 'next/image'

import {
  //AtSymbolIcon,
  //KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

//import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"


import { useActionState } from 'react';

import { authenticate } from '@/app/modules/auth/services/authenticate';

export function LoginForm() {

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );


  /*
  const [switchValue, setSwitchValue] = useState(false)

  function handleSwitchChange(c: boolean) {
    setSwitchValue(c);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white"></code>
        </pre>
      ),
    })
  }
  */

  return (
    <form action={formAction} className="space-y-3">
      <Card className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"> {/*className="mx-auto max-w-sm">*/}
        <div className="grid justify-center place-items-center p-1">
          <Image
            src="/logos/3.png"
            width={100}
            height={50}
            className="md-block"
            alt="Ceburrito.ph"
            priority
          />
        </div>

        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>

              </div>
              {/*<Input id="password" type={switchValue ? "text" : "password"} name="password" required />
              <div className="flex items-center space-x-2">
                <Switch id="show-password" checked={switchValue} onCheckedChange={(checked: boolean) => handleSwitchChange(checked)} />
                <Label htmlFor="show-password">Show Password</Label>
              </div>
              */}
              <Input id="password" type="password" name="password" required />

            </div>
            <Button disabled={isPending} type="submit" className="w-full">
              Login
            </Button>
            {/*<Button variant="outline" className="w-full">
              Login with Google
            </Button>*/}
              
          </div>
          <div className="mt-4 text-left text-sm">
            {" "}
            <Link href="/apps/passwordrecovery" className="underline">
              Forgot password?
            </Link>
          </div>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

    </form>
   

      
  )
}

