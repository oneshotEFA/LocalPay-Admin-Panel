import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-4", className)}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-sky-500" />
    </div>
  );
}
