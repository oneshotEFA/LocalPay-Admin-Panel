import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({
  title = "Error",
  message,
  onRetry,
}: ErrorAlertProps) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 shrink-0 w-full mb-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-400">{title}</h3>
          <div className="mt-1 text-sm text-red-400/80">{message}</div>
          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
