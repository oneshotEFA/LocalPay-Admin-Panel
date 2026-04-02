"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export type NativeSelectOption = { value: string; label: string };

export function NativeSelect({
  id,
  label,
  value,
  onValueChange,
  options,
  className,
  disabled,
}: {
  id?: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: NativeSelectOption[];
  className?: string;
  disabled?: boolean;
}) {
  const selectId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className={cn("space-y-1.5 min-w-0", className)}>
      <Label
        htmlFor={selectId}
        className="text-xs font-medium text-muted-foreground"
      >
        {label}
      </Label>
      <select
        id={selectId}
        disabled={disabled}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-background/80",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
