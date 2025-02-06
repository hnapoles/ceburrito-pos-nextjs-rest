import { signIn } from '@/app/modules/auth/services/auth';
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <Button type="submit">Sign in with Google</Button>
      </form>
    </div>
  )
}