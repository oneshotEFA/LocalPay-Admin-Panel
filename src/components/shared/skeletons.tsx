import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DashboardPageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/80 shadow-sm">
            <CardContent className="pt-6 pb-6 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="border-border/80 overflow-hidden shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-border px-5 py-4">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-0 divide-y divide-border p-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <Skeleton className="h-4 flex-1 max-w-[40%]" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ListPageSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <Card className="border-border/80 overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <div className="flex gap-4 border-b border-border px-4 py-3 bg-muted/30">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3 flex-1 max-w-[120px]" />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 items-center border-b border-border/60 last:border-0 px-4 py-3.5"
            >
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20 hidden sm:block" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-14 hidden md:block" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function AccountsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/80 shadow-sm">
            <CardContent className="p-5 flex gap-4">
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Card className="border-border/80 shadow-sm">
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
