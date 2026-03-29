import * as React from "react";

import { cn } from "@/lib/utils";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onChange, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(event.target.checked);
      onChange?.(event);
    };

    return (
      <label
        className={cn(
          "relative inline-flex h-5 w-10 items-center rounded-full",
          className
        )}
      >
        <input
          type="checkbox"
          role="switch"
          className="peer sr-only"
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        <span
          className={cn(
            "absolute inset-0 h-full w-full rounded-full border border-slate-200 bg-slate-200 transition-colors duration-200 ease-in-out",
            "peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-[2px] top-[2px] block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ease-in-out",
            "peer-checked:translate-x-[18px]",
            "peer-disabled:bg-slate-100"
          )}
        />
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
