import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ListPagination({
  page,
  totalLoaded,
  totalKnown,
  hasMore,
  isLoading,
  onPrev,
  onNext,
  noun,
  className,
}: {
  page: number;
  totalLoaded: number;
  totalKnown: number;
  hasMore: boolean;
  isLoading: boolean;
  onPrev: () => void;
  onNext: () => void;
  noun: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border/80 pt-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-xs text-muted-foreground">
        Page{" "}
        <span className="font-medium text-foreground tabular-nums">{page}</span>
        {" · "}
        Showing{" "}
        <span className="font-medium text-foreground tabular-nums">
          {totalLoaded}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground tabular-nums">
          {totalKnown}
        </span>{" "}
        {noun}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={onPrev}
          className="min-w-[5rem]"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasMore || isLoading}
          onClick={onNext}
          className="min-w-[5rem]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
