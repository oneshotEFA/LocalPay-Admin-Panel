"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { BetterAuthUser } from "@/lib/better-auth/types";
import { betterAuthClient } from "@/lib/better-auth/client";
import { onAuthChanged } from "@/lib/better-auth/token";

type AuthContextType = {
  user: BetterAuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
});

type AuthState = {
  user: BetterAuthUser | null;
  loading: boolean;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    let mounted = true;
    const refreshOnce = async () => {
      if (mounted) {
        setState((prev) => ({ ...prev, loading: true }));
      }
      try {
        const session = await betterAuthClient.getSession();
        if (!mounted) return;
        setState({ user: session?.user ?? null, loading: false });
      } catch {
        if (!mounted) return;
        setState({ user: null, loading: false });
      }
    };

    refreshOnce();
    const off = onAuthChanged(() => refreshOnce());
    return () => {
      mounted = false;
      off();
    };
  }, []);

  const refresh = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const session = await betterAuthClient.getSession();
      setState({ user: session?.user ?? null, loading: false });
    } catch {
      setState({ user: null, loading: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user: state.user, loading: state.loading, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
