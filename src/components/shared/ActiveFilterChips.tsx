import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FilterChipItem = { id: string; label: string; onRemove: () => void };

export function ActiveFilterChips({
  items,
  className,
}: {
  items: FilterChipItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        className,
      )}
    >
      {items.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex h-8 max-w-full items-center gap-1 rounded-full border border-border bg-muted/40 pl-3 pr-0.5 text-xs font-medium text-foreground"
        >
          <span className="truncate">{chip.label}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
            onClick={chip.onRemove}
            aria-label={`Remove ${chip.label}`}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </span>
      ))}
    </div>
  );
}
