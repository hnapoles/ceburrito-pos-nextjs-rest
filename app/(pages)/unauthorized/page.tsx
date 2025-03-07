'use client';

import { Button } from '@/components/ui/button-rounded-sm';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px] text-center shadow-md">
        <CardHeader>
          <CardTitle className="text-red-500 text-xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You do not have permission to access this page.
          </p>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
