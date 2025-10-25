import { Skeleton } from "@/components/ui/skeleton";

export default function ClerkUsersSkeleton() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/6" />
                <Skeleton className="h-6 w-1/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
