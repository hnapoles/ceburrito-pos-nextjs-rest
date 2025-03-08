import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="relative gap-4 bg-white border border-sm rounded-sm p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Items Loading Skeleton */}
        <div className="flex flex-col h-full flex-1">
          <div className="flex items-center">
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="border border-sm rounded-sm p-4 flex-1 overflow-auto">
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
          </div>
        </div>

        {/* Information Loading Skeleton */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col h-full">
            <div className="flex items-center">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="border border-sm rounded-sm p-4 flex-1">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
            </div>
          </div>

          <div className="flex flex-col h-full">
            <Skeleton className="h-6 w-32" />
            <div className="border border-sm rounded-sm p-4 flex-1">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
            </div>
          </div>

          <div className="flex flex-col h-full">
            <Skeleton className="h-6 w-32" />
            <div className="border border-sm rounded-sm p-4 flex-1">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 mt-2">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  );
}
