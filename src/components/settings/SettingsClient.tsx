"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Lock,
  KeyRound,
  User,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Smartphone,
  Sparkles,
  Trash2,
  Check,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { validateStrictName } from "@/lib/validations/name";

interface SettingsClientProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    subscriptionTier: string;
    hasPassword: boolean;
    hasPin: boolean;
    createdAt?: string;
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
  const router = useRouter();

  // Profile Form State
  const [name, setName] = useState(user.name || "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // PIN Form State
  const [hasPin, setHasPin] = useState(user.hasPin);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState<string | null>(null);
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);

  // Local Device Recognition State
  const [rememberedProfile, setRememberedProfile] = useState<{
    email: string;
    name: string;
    hasPin?: boolean;
  } | null>(null);
  const [deviceFeedback, setDeviceFeedback] = useState<string | null>(null);

  // Account Deletion State
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("resuma_remembered_profile");
      if (stored) {
        setRememberedProfile(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage read error
    }
  }, []);

  // Handle Profile Name Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setProfileSuccess(null);

    const validation = validateStrictName(name);
    if (!validation.isValid) {
      setNameError(validation.error || "Invalid name provided.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: validation.cleanedName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setNameError(data.error || "Failed to update profile.");
      } else {
        setProfileSuccess(data.message || "Profile updated successfully!");
        setName(validation.cleanedName);
        // Also update remembered profile in localStorage if matches
        if (rememberedProfile && user.email) {
          const updatedRemembered = {
            ...rememberedProfile,
            name: validation.cleanedName,
          };
          localStorage.setItem(
            "resuma_remembered_profile",
            JSON.stringify(updatedRemembered)
          );
          setRememberedProfile(updatedRemembered);
        }
        router.refresh();
      }
    } catch {
      setNameError("Network error. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (user.hasPassword && !currentPassword) {
      setPasswordError("Please provide your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: user.hasPassword ? currentPassword : "",
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Failed to update password.");
      } else {
        setPasswordSuccess(data.message || "Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.refresh();
      }
    } catch {
      setPasswordError("Network error. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle PIN Update
  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setPinSuccess(null);

    if (!/^\d{6}$/.test(pin)) {
      setPinError("PIN must be exactly 6 numeric digits.");
      return;
    }

    if (pin !== confirmPin) {
      setPinError("6-digit PIN and confirmation do not match.");
      return;
    }

    setIsUpdatingPin(true);
    try {
      const res = await fetch("/api/user/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPinError(data.error || "Failed to configure PIN.");
      } else {
        setPinSuccess(data.message || "6-Digit Quick PIN configured!");
        setHasPin(true);
        setPin("");
        setConfirmPin("");

        // Update local profile with hasPin flag for remembered card
        if (user.email) {
          const profileData = {
            email: user.email,
            name: name || user.name || "User",
            hasPin: true,
          };
          localStorage.setItem(
            "resuma_remembered_profile",
            JSON.stringify(profileData)
          );
          setRememberedProfile(profileData);
        }
        router.refresh();
      }
    } catch {
      setPinError("Network error. Please try again.");
    } finally {
      setIsUpdatingPin(false);
    }
  };

  // Clear remembered profile
  const handleClearRememberedProfile = () => {
    localStorage.removeItem("resuma_remembered_profile");
    setRememberedProfile(null);
    setDeviceFeedback("Saved profile has been removed from this browser.");
    setTimeout(() => setDeviceFeedback(null), 3500);
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    setDeleteError(null);

    if (deleteConfirmation !== "DELETE") {
      setDeleteError("Please type DELETE to confirm.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete account.");
        setIsDeleting(false);
      } else {
        // Sign out and redirect to home
        await signOut({ callbackUrl: "/" });
      }
    } catch {
      setDeleteError("Network error. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">
          <Shield className="h-3.5 w-3.5" />
          <span>Account & Security Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Security & Credentials
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your login password, set up a 6-digit Quick PIN, and configure
          your account profile.
        </p>
      </div>

      {/* Grid of Settings Cards */}
      <div className="grid grid-cols-1 gap-8">
        {/* CARD 1: Password Management */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-7 shadow-lg shadow-black/20 backdrop-blur-sm">
          <div className="flex items-start justify-between border-b border-zinc-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/80 text-zinc-200">
                <Lock className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Password Management
                </h2>
                <p className="text-xs text-zinc-400">
                  {user.hasPassword
                    ? "Change your master account password regularly to keep your account safe."
                    : "You do not have a password configured yet. Set a password below."}
                </p>
              </div>
            </div>

            {user.hasPassword ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
                <AlertCircle className="h-3 w-3" />
                Not Set
              </span>
            )}
          </div>

          <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
            {passwordError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {/* Current Password (if already has one) */}
            {user.hasPassword && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Re-enter new password"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Save Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* CARD 2: Quick 6-Digit PIN */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-7 shadow-lg shadow-black/20 backdrop-blur-sm">
          <div className="flex items-start justify-between border-b border-zinc-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/80 text-zinc-200">
                <KeyRound className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Quick 6-Digit PIN
                </h2>
                <p className="text-xs text-zinc-400">
                  Allows instant unlocking on recognized devices without having
                  to type your email and long password each time.
                </p>
              </div>
            </div>

            {hasPin ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3" />
                PIN Configured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400 border border-zinc-700">
                Not Setup
              </span>
            )}
          </div>

          <form onSubmit={handleUpdatePin} className="mt-6 space-y-4">
            {pinError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {pinSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{pinSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New 6-Digit PIN */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  6-Digit PIN <span className="text-amber-400">*</span>
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, "");
                    setPin(clean);
                  }}
                  required
                  placeholder="1 2 3 4 5 6"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3.5 py-2.5 text-center text-lg font-mono tracking-widest text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Numbers only (0-9). Exactly 6 digits.
                </p>
              </div>

              {/* Confirm 6-Digit PIN */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Confirm 6-Digit PIN <span className="text-amber-400">*</span>
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, "");
                    setConfirmPin(clean);
                  }}
                  required
                  placeholder="1 2 3 4 5 6"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3.5 py-2.5 text-center text-lg font-mono tracking-widest text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Re-enter the 6 digits to verify.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingPin || pin.length !== 6 || confirmPin.length !== 6}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isUpdatingPin ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving PIN...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>{hasPin ? "Update 6-Digit PIN" : "Enable Quick PIN"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* CARD 3: Profile Details */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-7 shadow-lg shadow-black/20 backdrop-blur-sm">
          <div className="flex items-start justify-between border-b border-zinc-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/80 text-zinc-200">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Profile Information
                </h2>
                <p className="text-xs text-zinc-400">
                  Your identity across resumes and the Resuma application.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-700">
                {user.role}
              </span>
              <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
                {user.subscriptionTier}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
            {nameError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{nameError}</span>
              </div>
            )}

            {profileSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Full Name <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(null);
                  }}
                  required
                  placeholder="First and Last Name"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950/70 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Strict human name validation enforced (no spam or duplicates).
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email Address (Primary Account)
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3.5 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Account identity email cannot be modified directly.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Update Name</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* CARD 4: Device & Quick Login Memory */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-7 shadow-lg shadow-black/20 backdrop-blur-sm">
          <div className="flex items-start justify-between border-b border-zinc-800/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700/80 text-zinc-200">
                <Smartphone className="h-5 w-5 text-zinc-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Device Memory & Quick Access
                </h2>
                <p className="text-xs text-zinc-400">
                  Resuma remembers your profile on this browser so you can log in
                  with just your 6-digit PIN.
                </p>
              </div>
            </div>
          </div>

          {deviceFeedback && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{deviceFeedback}</span>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
            <div>
              <div className="text-sm font-medium text-white">
                {rememberedProfile ? (
                  <span className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Profile active on this browser: {rememberedProfile.email}
                  </span>
                ) : (
                  <span className="text-zinc-400">
                    No profile currently remembered on this browser session.
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                If you are on a shared or public computer, you can clear this
                memory at any time.
              </p>
            </div>

            {rememberedProfile && (
              <button
                type="button"
                onClick={handleClearRememberedProfile}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-red-400 hover:border-red-500/40 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                <span>Clear Saved Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 5: Danger Zone */}
        <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-6 sm:p-7 shadow-lg shadow-black/20 backdrop-blur-sm">
          <div className="flex items-start justify-between border-b border-red-500/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-red-400">
                  Danger Zone
                </h2>
                <p className="text-xs text-red-400/70">
                  Permanently delete your account and all associated data.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-300 font-medium mb-1">
                Are you sure you want to delete your account?
              </p>
              <p className="text-xs text-red-400/80 mb-4">
                This action is irreversible. All your resumes, data, and settings will be permanently removed from our servers.
              </p>

              {deleteError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/20 border border-red-500/30 p-3 text-sm text-red-200 mb-4">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-red-300">
                  Type <span className="font-mono bg-red-500/20 px-1 py-0.5 rounded text-red-200">DELETE</span> to confirm
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => {
                      setDeleteConfirmation(e.target.value);
                      setDeleteError(null);
                    }}
                    placeholder="DELETE"
                    className="w-full sm:max-w-[200px] rounded-lg border border-red-500/30 bg-red-950/50 px-3 py-2 text-sm text-red-100 placeholder-red-500/50 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmation !== "DELETE"}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Account</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
