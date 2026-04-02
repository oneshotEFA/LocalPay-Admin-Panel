import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function QueryError({
  title = "Something went wrong",
  message = "We couldn’t load this data. Check your connection and try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
      <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 py-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{message}</p>
        </div>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
            Retry
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
