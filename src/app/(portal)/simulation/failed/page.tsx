import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";

export default function SimulationFailedPage() {
  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-300">
      <PageHeader
        title="Payment failed"
        description="The checkout did not complete successfully."
        action={
          <Link
            href="/simulation"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </Link>
        }
      />

      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-6">
        <p className="text-sm text-muted-foreground">
          If this keeps happening, double-check your API credentials and try a
          smaller amount.
        </p>
      </div>
    </div>
  );
}

