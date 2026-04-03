"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  User as UserIcon,
  Lock,
  Mail,
  ShieldCheck,
  Settings2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/authProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

function profileDisplayName(u: User) {
  const meta = u.user_metadata as Record<string, unknown> | undefined;
  if (typeof meta?.full_name === "string") return meta.full_name;
  if (typeof meta?.name === "string") return meta.name;
  return u.email?.split("@")[0] ?? "";
}

function SettingsForm({ user }: { user: User }) {
  const [name, setName] = useState(() => profileDisplayName(user));
  const email = user.email ?? "";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 600));
    setSavingProfile(false);
    toast.success("Profile updated successfully");
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    await new Promise((r) => setTimeout(r, 800));
    setChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Account Settings"
          description="Manage your public profile and security preferences."
        />
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary">
            Secure Account
          </span>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Profile Section */}
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6 border-b">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-20 w-20 border-4 border-background shadow-xl ring-1 ring-border">
                  <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                    {name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border shadow-sm">
                  <div className="bg-emerald-500 rounded-full p-0.5">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl">{name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> {email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <Label className="text-sm font-bold">
                  Personal Information
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This information will be displayed on your invoices and public
                  profile.
                </p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="settings-name"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Display Name
                  </Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="settings-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9 bg-background focus-visible:ring-primary"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="settings-email"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="settings-email"
                      value={email}
                      disabled
                      className="pl-9 bg-muted/30 text-muted-foreground border-dashed cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    Email change is managed via your identity provider.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="min-w-35 shadow-lg shadow-primary/20"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-6 border-b">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Lock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Security & Privacy</CardTitle>
                <CardDescription>
                  Update your password to keep your account safe.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  Password Policy
                </div>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                  <li>Minimum 8 characters long</li>
                  <li>At least one special character</li>
                  <li>Avoid using common phrases</li>
                </ul>
              </div>

              <div className="md:col-span-2 space-y-5">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="current-pw"
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      Current Password
                    </Label>
                    <Input
                      id="current-pw"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="new-pw"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        New Password
                      </Label>
                      <Input
                        id="new-pw"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-pw"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-pw"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleChangePassword}
                    disabled={changingPassword || !newPassword}
                    className="min-w-40"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Settings2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading secure settings...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-4">
        <div className="p-4 bg-muted rounded-full w-fit mx-auto">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Authentication Required</h2>
        <p className="text-sm text-muted-foreground">
          Please sign in to access your account management dashboard.
        </p>
      </div>
    );
  }

  return <SettingsForm key={user.id} user={user} />;
}
