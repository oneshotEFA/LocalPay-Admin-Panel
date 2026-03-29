import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/PortalShell";

export default function PortalLayout({ children }: { children: ReactNode }) {
  // Simple auth gate placeholder
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <PortalShell>{children}</PortalShell>;
}
