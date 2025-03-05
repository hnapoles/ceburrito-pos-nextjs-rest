import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card-rounded-sm';

export default function Loading() {
  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {/* Left Side Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-md"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 w-full bg-gray-200 animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    </div>
  );
}
