'use server'

import { signIn } from "@/auth"

export async function GoogleSignIn(callbackUrl: string) {

    await signIn("google", {callbackUrl: callbackUrl})
        
}