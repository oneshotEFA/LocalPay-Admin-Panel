"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, User, Lock } from "lucide-react";
import { toast } from "sonner";

// TODO: replace with real user data from auth context
const mockUser = {
  fullName: "Ephraim Mesfin",
  email: "ephraim@example.com",
};

export default function SettingsPage() {
  const [name, setName] = useState(mockUser.fullName);
  const [email] = useState(mockUser.email);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);

    // TODO: connect API
    await new Promise((r) => setTimeout(r, 600));

    setSavingProfile(false);
    toast.success("Profile updated");
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setChangingPassword(true);

    // TODO: connect API
    await new Promise((r) => setTimeout(r, 800));

    setChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    toast.success("Password changed successfully");
  };

  return (
    <div className="space-y-6 pb-10 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal account and security settings.
        </p>
      </div>

      {/* Profile Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <User className="h-4 w-4 text-slate-400" />
            Profile Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold">
                {name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm font-semibold text-slate-900">{name}</p>
              <p className="text-xs text-slate-400">{email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-500 uppercase">
              Full Name
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-500 uppercase">Email</Label>
            <Input value={email} disabled className="bg-slate-50" />
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            {savingProfile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Lock className="h-4 w-4 text-slate-400" />
            Security
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          <div className="space-y-2">
            <Label className="text-xs text-slate-500 uppercase">
              Current Password
            </Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-500 uppercase">
              New Password
            </Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-slate-500 uppercase">
              Confirm Password
            </Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            {changingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
