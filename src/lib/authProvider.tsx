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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("AuthProvider mounted");
  const [user, setUser] = useState<BetterAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      try {
        const session = await betterAuthClient.getSession();
        console.log("Auth session refreshed:", session);
        if (!mounted) return;
        setUser(session?.user ?? null);
      } catch {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    refresh();
    const off = onAuthChanged(() => refresh());
    return () => {
      mounted = false;
      off();
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const session = await betterAuthClient.getSession();
      setUser(session?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
