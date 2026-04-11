"use client";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowUpRight,
  Key,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/authProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import type { BetterAuthUser } from "@/lib/better-auth/types";
import { authApi } from "@/lib/api";

function profileDisplayName(u: BetterAuthUser) {
  if (typeof u.name === "string" && u.name.trim()) return u.name;
  return u.email?.split("@")[0] ?? "";
}

function SettingsForm({ user }: { user: BetterAuthUser }) {
  const [name, setName] = useState(() => profileDisplayName(user));
  const email = user.email ?? "";
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [actionError, setActionError] = useState("");
  const [totpInfo, setTotpInfo] = useState<{
    totpURI: string;
    backupCodes: string[];
  } | null>(null);
  const { refresh } = useAuth();
  const [code, setCode] = useState("");
  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handlePasswordUpdate = async () => {
    setChangingPassword(true);
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setChangingPassword(false);
      return;
    }
    try {
      const res = await authApi.changePassword(currentPassword, newPassword);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred while updating password",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleEnableStep1 = async () => {
    setActionError("");
    setEnabling(true);
    try {
      const res = await authApi.enable2FA(password);
      setTotpInfo(res);
      setStep(2);
      setPassword("");
    } catch (err: any) {
      setActionError(
        err.data?.message || err.message || "Failed to enable 2FA.",
      );
    } finally {
      setEnabling(false);
    }
  };

  const handleEnableStep2 = async () => {
    setActionError("");
    if (code.length !== 6) {
      setActionError("Must be exactly 6 digits.");
      return;
    }
    setVerifying(true);
    try {
      await authApi.verifyTOTP(code);
      toast.success("Two-factor authentication enabled");
      setStep(0);
      setCode("");
      setTotpInfo(null);
      await refresh();
    } catch (err: any) {
      setActionError(
        err.data?.message || err.message || "Invalid code. Please try again.",
      );
      setCode("");
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable = async () => {
    setActionError("");
    setDisabling(true);
    try {
      await authApi.disable2FA(password);
      toast.success("Two-factor authentication disabled");
      setPassword("");
      setStep(0);
      await refresh();
    } catch (err: any) {
      setActionError(
        err.data?.message || err.message || "Failed to disable 2FA.",
      );
    } finally {
      setDisabling(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Account Settings"
        description="Manage your profile, password, and developer tools."
      />

      <Card className="border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/70 bg-muted/30 pb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Mail className="h-3 w-3" />
                {email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Display Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground">
                Email
              </Label>
              <Input value={email} disabled className="bg-muted/30 italic" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              onClick={() => {
                setSavingProfile(true);
                setTimeout(() => {
                  setSavingProfile(false);
                  toast.success("Profile updated");
                }, 1000);
              }}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted/50 text-primary">
                <Lock className="h-4 w-4" />
              </span>
              <div className="space-y-1">
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your credentials below.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Confirm New</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                variant="secondary"
                onClick={handlePasswordUpdate}
                disabled={!newPassword || changingPassword}
              >
                {changingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted/50 text-primary">
                <Zap className="h-4 w-4" />
              </span>
              <div className="space-y-1">
                <CardTitle>Integration</CardTitle>
                <CardDescription>Operational documentation.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="text-xs leading-6 text-muted-foreground">
                Integration setup, configuration notes, and code examples now
                live on a dedicated page.
              </p>
            </div>
            <Link
              href="/integration"
              className={buttonVariants({ className: "w-full" })}
            >
              Open integration page
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 bg-muted/20 space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              Two-Factor Authentication
              {user.twoFactorEnabled ? (
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-amber-500" />
              )}
            </CardTitle>
            <CardDescription>
              Extra security for your login flow.
            </CardDescription>
          </div>
          {step === 0 && (
            <Button
              variant={user.twoFactorEnabled ? "outline" : "default"}
              size="sm"
              onClick={() => setStep(1)}
            >
              {user.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          )}
        </CardHeader>

        <CardContent className="pt-6">
          {step === 0 && (
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {user.twoFactorEnabled
                ? "Two-factor authentication is active. Use your authenticator app to generate codes."
                : "Add an extra layer of security by requiring a 6-digit code from your app."}
            </p>
          )}

          {step === 1 && (
            <div className="max-w-md animate-in fade-in slide-in-from-top-2 space-y-4">
              <div className="space-y-1">
                <Label className="text-sm">Confirm Password</Label>
                <p className="text-xs text-muted-foreground">
                  Verify your identity to{" "}
                  {user.twoFactorEnabled ? "disable" : "enable"} 2FA.
                </p>
              </div>
              {actionError && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2.5">
                  {actionError}
                </div>
              )}
              <div className="space-y-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      password &&
                      !enabling &&
                      !disabling
                    )
                      user.twoFactorEnabled
                        ? handleDisable()
                        : handleEnableStep1();
                  }}
                />
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    disabled={!password || enabling || disabling}
                    onClick={() =>
                      user.twoFactorEnabled
                        ? handleDisable()
                        : handleEnableStep1()
                    }
                  >
                    {(enabling || disabling) && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setStep(0);
                      setPassword("");
                      setActionError("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && totpInfo && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      1
                    </span>
                    Scan QR Code
                  </h3>
                  <div className="bg-white p-4 inline-block rounded-xl border border-border shadow-sm">
                    <QRCodeSVG value={totpInfo.totpURI} size={160} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      2
                    </span>
                    Verify Code
                  </h3>
                  {actionError && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-lg px-3 py-2.5">
                      {actionError}
                    </div>
                  )}
                  <div className="space-y-4">
                    <Input
                      type="text"
                      maxLength={6}
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      className="h-12 text-center text-xl tracking-[0.3em] font-mono"
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          code.length === 6 &&
                          !verifying
                        )
                          handleEnableStep2();
                      }}
                    />
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        disabled={verifying || code.length !== 6}
                        onClick={handleEnableStep2}
                      >
                        {verifying && (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        Verify Setup
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setStep(0);
                          setTotpInfo(null);
                          setCode("");
                          setActionError("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-border/70">
                <h3 className="font-semibold text-sm flex items-center gap-2 text-destructive">
                  <Key className="h-4 w-4" /> Save Recovery Codes
                </h3>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {totpInfo.backupCodes.map((c, i) => (
                    <div
                      key={i}
                      className="bg-muted/50 font-mono text-[10px] text-center py-2 px-1 rounded border border-border/50 select-all"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  const { user, loading } = useAuth();

  // Only show spinner on first load (no user yet).
  // If user is already loaded, keep SettingsForm mounted even if loading
  // briefly flips true again — this prevents Sonner from being unmounted
  // mid-toast and toast disappearing.
  if (loading && !user)
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );

  return user ? <SettingsForm key={user.id} user={user} /> : null;
}
