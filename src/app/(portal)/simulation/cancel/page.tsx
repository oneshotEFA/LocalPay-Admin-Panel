import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";

export default function SimulationCancelPage() {
  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-300">
      <PageHeader
        title="Payment cancelled"
        description="The checkout was cancelled before completion."
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
          You can return to the simulation page and start a new checkout.
        </p>
      </div>
    </div>
  );
}

