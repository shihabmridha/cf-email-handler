'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function DraftLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Draft Emails</h1>
      </div>

      <div className="rounded-md border">
        <div className="border-b px-4 py-3 bg-muted/40">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-4 py-3 border-b last:border-0">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
