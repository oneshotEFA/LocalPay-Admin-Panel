import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Local Bank Payment Verification | Client Portal",
  description: "Payment gateway integration portal",
};

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

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64">
        <Topbar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
