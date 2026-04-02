"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mobile-first bottom sheet for filters. On `sm+` renders as centered dialog.
 */
export function FilterDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  activeCount,
  onClearAll,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  activeCount: number;
  onClearAll: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 p-0 sm:max-w-md",
          "max-h-[90vh] overflow-hidden flex flex-col",
          "max-sm:fixed max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:bottom-0 max-sm:translate-x-0 max-sm:translate-y-0",
          "max-sm:max-h-[min(88vh,560px)] max-sm:rounded-t-2xl max-sm:rounded-b-none max-sm:border-b-0",
        )}
      >
        <DialogHeader className="space-y-1 border-b border-border px-5 py-4 text-left">
          <div className="flex items-center justify-between gap-2 pr-8">
            <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
            {activeCount > 0 ? (
              <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                {activeCount} active
              </span>
            ) : null}
          </div>
          {description ? (
            <DialogDescription className="text-sm">{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">{children}</div>
        <DialogFooter className="gap-2 border-t border-border bg-muted/30 px-5 py-4 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => onClearAll()}
          >
            Clear all
          </Button>
          <Button type="button" size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
