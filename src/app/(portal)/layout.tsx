"use client";
import { useEffect, type ReactNode } from "react";
import { PortalShell } from "@/components/shared/layout/PortalShell";
import { useAuth } from "@/lib/authProvider";
import { useRouter } from "next/navigation";

export default function PortalLayout({ children }: { children: ReactNode }) {
  // Simple auth gate placeholder
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading) return; // wait until auth finishes

    if (!user) {
      console.log("User not authenticated, redirecting...");
      router.replace("/login"); // better than push
    }
  }, [user, loading, router]);

  return <PortalShell user={user}>{children}</PortalShell>;
}
