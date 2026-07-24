import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../api/profile";
import { authService } from "../api/auth";
import {
  User,
  Mail,
  Shield,
  Phone,
  Briefcase,
  Calendar,
  Lock,
  Camera,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  UserCheck,
  Building,
  BadgeAlert,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [deletingPic, setDeletingPic] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Success and error state messages
  const [message, setMessage] = useState({ text: "", type: "" });

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    department: "",
    designation: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        department: data.department || "",
        designation: data.designation || "",
      });
      // Also update stored user in localStorage to keep header sync
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          name: data.name,
          profilePicUrl: data.profilePicUrl,
        })
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to load user profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await profileService.updateProfile(formData);
      setProfile(updated);
      showToast("Profile details updated successfully!", "success");

      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          name: updated.name,
        })
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New password and confirm password do not match!", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("New password must be at least 6 characters long", "error");
      return;
    }

    setSavingPassword(true);
    try {
      await profileService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showToast("Password updated successfully!", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to update password. Check current password.",
        "error"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file", "error");
      return;
    }

    setUploadingPic(true);
    try {
      const updated = await profileService.uploadAvatar(file);
      setProfile(updated);
      showToast("Profile picture uploaded successfully!", "success");

      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          profilePicUrl: updated.profilePicUrl,
        })
      );
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to upload profile picture",
        "error"
      );
    } finally {
      setUploadingPic(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    setDeletingPic(true);
    try {
      const updated = await profileService.deleteAvatar();
      setProfile(updated);
      showToast("Profile picture removed", "success");

      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          profilePicUrl: null,
        })
      );
    } catch (err) {
      showToast("Failed to remove profile picture", "error");
    } finally {
      setDeletingPic(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await profileService.deleteProfile();
      authService.logout();
      navigate("/login");
    } catch (err) {
      showToast("Failed to delete account", "error");
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  const handleBackToDashboard = () => {
    if (profile?.role === "ADMIN") {
      navigate("/dashboard");
    } else {
      navigate("/employeeDashboard");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Loading User Profile...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-1">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20">
          User Account Management
        </div>
      </div>

      {/* Toast Notification Alert */}
      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border shadow-md transition-all ${message.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300"
              : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300"
            }`}
        >
          {message.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Hero Profile Banner Header with Avatar Upload */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/60 bg-gradient-to-r from-white/60 via-white/80 to-white/60 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* Avatar Picture Circle with Edit Hover */}
          <div className="relative group">
            <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-4xl shadow-lg overflow-hidden border-4 border-white dark:border-slate-800">
              {profile?.profilePicUrl ? (
                <img
                  src={profile.profilePicUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Camera Overlay Badge */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPic}
              className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
              title="Upload / Change Profile Picture"
            >
              {uploadingPic ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Profile Basic Information */}
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {profile?.name}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${profile?.role === "ADMIN"
                    ? "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/20"
                    : "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20"
                  }`}
              >
                {profile?.role === "ADMIN" ? "System Administrator" : "Employee"}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="h-4 w-4 text-slate-400" /> {profile?.email}
            </p>

            {profile?.employeeCode && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700">
                  Code: {profile.employeeCode}
                </span>
                {profile?.department && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700">
                    Dept: {profile.department}
                  </span>
                )}
                {profile?.designation && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700">
                    Role: {profile.designation}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons: Remove Picture */}
          {profile?.profilePicUrl && (
            <button
              onClick={handleDeleteAvatar}
              disabled={deletingPic}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-xl hover:bg-rose-100 transition disabled:opacity-50"
            >
              {deletingPic ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Remove Picture
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid: Personal Info Form + Security Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Update Personal Profile Details */}
        <div className="p-6 rounded-3xl border border-slate-200/60 bg-white/60 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/40 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200/50 pb-4 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Personal Details
              </h2>
              <p className="text-xs text-slate-500">
                Update your public profile information
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            {/* Email (Read only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Email Address (Primary Account Key)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200/50 bg-slate-100 text-sm text-slate-500 font-medium dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Employee Specific Fields if Employee */}
            {profile?.role === "EMPLOYEE" && (
              <>
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Department & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Department
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        placeholder="Department"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Designation
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) =>
                          setFormData({ ...formData, designation: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        placeholder="Designation"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
            >
              {savingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Personal Details
            </button>
          </form>
        </div>

        {/* Section 2: Password & Security Update Form */}
        <div className="p-6 rounded-3xl border border-slate-200/60 bg-white/60 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/40 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-200/50 pb-4 dark:border-slate-800/50">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Password & Security
              </h2>
              <p className="text-xs text-slate-500">
                Change your account password
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  placeholder="Enter new password (min 6 chars)"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md hover:bg-purple-700 transition active:scale-95 disabled:opacity-50"
            >
              {savingPassword ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Update Security Password
            </button>
          </form>
        </div>
      </div>

      {/* Section 3: Danger Zone - Account Deletion */}
      <div className="p-6 rounded-3xl border border-rose-200/60 bg-rose-50/40 shadow-lg backdrop-blur-md dark:border-rose-950/60 dark:bg-rose-950/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <BadgeAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-900 dark:text-rose-200">
              Danger Zone
            </h2>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
              Irreversible actions regarding your account profile
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-rose-200/40 dark:border-rose-900/40">
          <div>
            <h4 className="text-sm font-bold text-rose-950 dark:text-rose-100">
              Delete Profile Account
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Permanently delete your profile, credentials, and all associated personnel data.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition active:scale-95 shrink-0"
          >
            <Trash2 className="h-4 w-4" /> Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Confirm Profile Deletion
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you absolutely sure you want to delete your profile account? This operation cannot be undone and will erase your user access immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition disabled:opacity-50"
              >
                {deletingAccount ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
