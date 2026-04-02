"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./authProvider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30 * 1000,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="localpay-ui-theme"
    >
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
