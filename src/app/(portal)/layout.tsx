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
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return <PortalShell>{children}</PortalShell>;
}
