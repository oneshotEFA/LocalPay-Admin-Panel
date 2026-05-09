"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { authApi } from "@/lib/api/client";
import { useAuth } from "@/lib/authProvider";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.signInEmail(email, password);
      if (res.user.role !== "CLIENT") {
        toast.error(`Access denied. You are: ${res.user.role}`);
        setError("Access denied. Please use a client account.");
        return;
      }
      if ("twoFactorRedirect" in res && res.twoFactorRedirect) {
        setStep(2);
      } else {
        await refresh();
        toast.success("Signed in — redirecting…");
        router.push("/");
      }
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "An unexpected error occurred. Please try again.";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVerifyError(null);
    setIsVerifying(true);
    try {
      await authApi.verifyTOTP(code);
      await refresh();
      toast.success("Two-factor authentication verified — redirecting…");
      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Verification failed. Please check your code and try again.";
      toast.error(message);
      setVerifyError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-104 xl:w-md bg-sidebar text-sidebar-foreground flex-col justify-between p-10 xl:p-12 relative overflow-hidden shrink-0 border-r border-sidebar-border">
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex items-center gap-2.5 min-w-0">
          <BrandLogo className="h-9 w-9 shrink-0 border-sidebar-border/80" />
          <span className="font-semibold tracking-tight text-lg truncate">LocalPay</span>
        </div>
        <div className="relative space-y-6">
          <div>
            <h2 className="text-2xl font-semibold leading-snug text-sidebar-foreground">
              Ethiopian payment verification, automated.
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
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
                <div className="h-5 w-5 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0 border border-sidebar-border">
                  <div className="h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
                </div>
                <span className="text-sm text-sidebar-foreground/85">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} LocalPay
        </p>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 -mt-10">
          <div className="w-full max-w-sm space-y-8">
            <div className="lg:hidden flex items-center gap-2.5">
              <BrandLogo className="h-9 w-9 shrink-0" />
              <span className="font-semibold text-lg">LocalPay</span>
            </div>

            {step === 1 ? (
              <>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
                  <p className="text-muted-foreground text-sm mt-1">Client portal access</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-primary font-medium hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-background"
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2.5">
                      {error}
                    </div>
                  )}
                  <Button type="submit" disabled={loading} className="w-full h-11">
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
              </>
            ) : (
              <>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Two-Factor Auth</h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Enter the code from your authenticator app
                  </p>
                </div>
                <form onSubmit={handleVerify} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="code">Authentication Code</Label>
                    <Input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      className="h-14 text-center text-2xl tracking-[0.25em] font-mono bg-background"
                      placeholder="000000"
                    />
                  </div>
                  {verifyError && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2.5">
                      {verifyError}
                    </div>
                  )}
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isVerifying || code.length !== 6}
                      className="w-full h-11"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying…
                        </>
                      ) : (
                        "Verify and proceed"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="w-full h-11 text-muted-foreground hover:text-foreground"
                    >
                      Back to login
                    </Button>
                  </div>
                </form>
              </>
            )}

            <p className="text-xs text-center text-muted-foreground">
              Need integration help?{" "}
              <a
                href="mailto:efa.traww21@gmail.com"
                className="text-foreground underline underline-offset-2 hover:text-primary"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
