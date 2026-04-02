"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data?.session) {
        toast({
          title: "Access Denied",
          description: error?.message || "Invalid credentials provided.",
          variant: "destructive",
        });
        setError(error?.message || "Invalid credentials provided.");
        return;
      }

      toast({
        title: "Authorization Successful",
        description: "Loading secure terminal...",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        title: "System Error",
        description: "An unexpected error occurred during login.",
        variant: "destructive",
      });
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex lg:w-105 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden shrink-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold tracking-tight text-lg">
            LocalPay
          </span>
        </div>
        <div className="relative space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white leading-snug">
              Ethiopian payment verification, automated.
            </h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              Real-time verification of Telebirr, CBE, Abyssinia, NIB and eBirr
              deposits — with webhook delivery to your platform.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Bank-grade receipt verification",
              "Webhook callbacks on settlement",
              "Multi-method: SMS, screenshot, link",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-slate-600">
          © {new Date().getFullYear()} LocalPay
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-slate-900 font-semibold text-lg">
              LocalPay
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Sign in
            </h1>
            <p className="text-slate-500 text-sm mt-1">Client portal access</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 bg-white border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 bg-white border-slate-200"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <p className="text-xs text-center text-slate-400">
            Need integration help?{" "}
            <a
              href="mailto:support@habeshatech.com"
              className="text-slate-600 underline underline-offset-2 hover:text-slate-900"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
