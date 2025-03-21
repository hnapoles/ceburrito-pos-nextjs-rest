//import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';

export default function Loading() {
  return (
    <div className="grid gap-4">
      {/* Left Side Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-md"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full bg-gray-200 animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    </div>
  );
}
