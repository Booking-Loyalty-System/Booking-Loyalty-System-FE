import React, { useState, useEffect } from "react";
import {
  User,
  Edit3,
  Lock,
  Bell,
  ShieldCheck,
  Download,
  ExternalLink,
  Trash2,
  Check,
  X,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Globe,
} from "lucide-react";
import {
  useCustomerMe,
  useUpdateCustomer,
} from "@/features/products/application/useCustomer.ts";
import { useAuth } from "@/features/products/application/useAuth.ts";
import { useTheme } from "@/core/context/ThemeContext.tsx";
import { useLanguage } from "@/core/context/LanguageContext.tsx";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const ProfileSettings: React.FC = () => {
  const { customerMe } = useCustomerMe();
  const { updateCustomer, isUpdating } = useUpdateCustomer();
  const { user, changePassword, isChangingPassword } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation("customer");

  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSMSNotify] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Form state for Profile
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  // Form state for Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (customerMe && !isEditing) {
      setFormData({
        fullName: customerMe.fullName || user?.fullName || "",
        phoneNumber: customerMe.phoneNumber || "",
      });
    }
  }, [customerMe, user, isEditing]);

  const handleSave = async () => {
    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      toast.error(t("settings.toast.fillRequired", { defaultValue: "Please fill in all required fields" }));
      return;
    }

    try {
      await updateCustomer({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      });
      toast.success(t("settings.toast.updateSuccess", { defaultValue: "Profile updated successfully!" }));
      setIsEditing(false);
    } catch (error) {
      toast.error(t("settings.toast.updateFailed", { defaultValue: "Failed to update profile. Please try again." }));
      console.error("Update profile error:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: customerMe?.fullName || user?.fullName || "",
      phoneNumber: customerMe?.phoneNumber || "",
    });
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t("settings.toast.fillPassword", { defaultValue: "Please fill in all password fields" }));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("settings.toast.passwordMismatch", { defaultValue: "New passwords do not match" }));
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t("settings.toast.passwordLength", { defaultValue: "Password must be at least 6 characters long" }));
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      toast.success(t("settings.toast.passwordSuccess", { defaultValue: "Password updated successfully!" }));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        t("settings.toast.passwordFailed", { defaultValue: "Failed to change password. Please check your current password and try again." })
      );
      console.error("Change password error:", error);
    }
  };

  return (
    <div className="w-full font-sans text-slate-800 dark:text-slate-100">
      <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-6">
        {t("settings.subtitle", { defaultValue: "Manage your account information and preferences" })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* CỘT TRÁI + GIỮA (2/3): FORM CHÍNH */}
        <div className="lg:col-span-2 space-y-6">
          {/* Khối 1: Personal Information */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white">
                <User className="w-5 h-5 text-blue-600" />
                <span>{t("settings.personalInfo.sectionTitle", { defaultValue: "Personal Information" })}</span>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 border-2 border-blue-600 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t("settings.personalInfo.btnEdit", { defaultValue: "Edit" })}</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-1 border-2 border-slate-300 text-slate-600 dark:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{t("settings.personalInfo.btnCancel", { defaultValue: "Cancel" })}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-1 bg-blue-600 text-white border-2 border-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>{t("settings.personalInfo.btnSave", { defaultValue: "Save" })}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.personalInfo.labelFullName", { defaultValue: "Full Name" })}
                </label>
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={
                    isEditing
                      ? formData.fullName
                      : customerMe?.fullName || user?.fullName || "Khách hàng"
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none transition-colors ${
                    isEditing
                      ? "bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700 text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                      : "bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-850 text-slate-800 dark:text-slate-200"
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.personalInfo.labelPhoneNumber", { defaultValue: "Phone Number" })}
                </label>
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={isEditing ? formData.phoneNumber : customerMe?.phoneNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none transition-colors ${
                    isEditing
                      ? "bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700 text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                      : "bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-850 text-slate-800 dark:text-slate-200"
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.personalInfo.labelEmailAddress", { defaultValue: "Email Address" })}{" "}
                  <span className="normal-case text-[10px] text-slate-400 font-medium">
                    {t("settings.personalInfo.emailReadOnly", { defaultValue: "(Read-only)" })}
                  </span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={customerMe?.email || user?.email || ""}
                  className="w-full bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Khối 2: Password & Security */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <span>{t("settings.passwordSecurity.sectionTitle", { defaultValue: "Password & Security" })}</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.passwordSecurity.labelCurrentPassword", { defaultValue: "Current Password" })}
                </label>
                <input
                  type="password"
                  placeholder={t("settings.passwordSecurity.placeholderCurrentPassword", { defaultValue: "Enter current password" })}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.passwordSecurity.labelNewPassword", { defaultValue: "New Password" })}
                </label>
                <input
                  type="password"
                  placeholder={t("settings.passwordSecurity.placeholderNewPassword", { defaultValue: "Enter new password" })}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.passwordSecurity.labelConfirmNewPassword", { defaultValue: "Confirm New Password" })}
                </label>
                <input
                  type="password"
                  placeholder={t("settings.passwordSecurity.placeholderConfirmNewPassword", { defaultValue: "Confirm new password" })}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold w-full sm:w-auto px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
              >
                {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                {isChangingPassword
                  ? t("settings.passwordSecurity.btnUpdating", { defaultValue: "Updating..." })
                  : t("settings.passwordSecurity.btnUpdatePassword", { defaultValue: "Update Password" })}
              </button>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    {t("settings.passwordSecurity.twoFactorTitle", { defaultValue: "Two-Factor Authentication" })}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    {t("settings.passwordSecurity.twoFactorDesc", { defaultValue: "Add an extra layer of security to your account" })}
                  </p>
                </div>
                {/* Custom Toggle Switch */}
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${
                    twoFactor ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      twoFactor ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (1/3): THẺ THÔNG TIN TỔNG QUAN & CONFIG PHỤ */}
        <div className="space-y-6">
          {/* Khối Thẻ Thành Viên Xanh Dương */}
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-blue-100 font-medium">
                  {t("settings.memberCard.memberSince", { defaultValue: "Member Since" })}
                </p>
                <p className="text-lg font-black tracking-wide">
                  {customerMe?.createdAt
                    ? new Date(customerMe.createdAt).toLocaleDateString("vi-VN", {
                        month: "long",
                        year: "numeric",
                      })
                    : "2026"}
                </p>
              </div>
            </div>
            <div className="pt-2 space-y-2 text-sm font-semibold border-t border-white/10">
              <div className="flex justify-between opacity-90">
                <span>{t("settings.memberCard.totalBookings", { defaultValue: "Total Bookings" })}</span>
                <span className="font-bold">{customerMe?.totalWashes ?? 0}</span>
              </div>
              <div className="flex justify-between opacity-90">
                <span>{t("settings.memberCard.totalSpent", { defaultValue: "Total Spent" })}</span>
                <span className="font-bold">
                  {(customerMe?.totalSpent ?? 0).toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span>{t("settings.memberCard.pointsBalance", { defaultValue: "Points Balance" })}</span>
                <span className="text-base font-black text-amber-300">
                  {customerMe?.totalPoints ?? 0} pts
                </span>
              </div>
            </div>
          </div>

          {/* Khối Cấu Hình Notifications Tắt/Mở */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-850 pb-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>{t("settings.notificationsSection.sectionTitle", { defaultValue: "Notifications" })}</span>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {t("settings.notificationsSection.emailNotifications", { defaultValue: "Email Notifications" })}
                </span>
                <button
                  onClick={() => setEmailNotify(!emailNotify)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    emailNotify ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      emailNotify ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {t("settings.notificationsSection.smsNotifications", { defaultValue: "SMS Notifications" })}
                </span>
                <button
                  onClick={() => setSMSNotify(!smsNotify)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    smsNotify ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      smsNotify ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {t("settings.notificationsSection.marketingEmails", { defaultValue: "Marketing Emails" })}
                </span>
                <button
                  onClick={() => setMarketingEmail(!marketingEmail)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    marketingEmail ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      marketingEmail ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Khối Appearance (Dark/Light Mode) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              <span>{t("settings.appearance.sectionTitle", { defaultValue: "Appearance" })}</span>
            </div>

            <div
              className={`relative rounded-xl overflow-hidden h-16 transition-all duration-500 ${
                isDark
                  ? "bg-gradient-to-br from-slate-800 to-slate-900"
                  : "bg-gradient-to-br from-slate-55 to-blue-50"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isDark ? "bg-slate-600 text-slate-300" : "bg-white text-amber-500 shadow-sm"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div className={`h-5 w-px ${isDark ? "bg-slate-600" : "bg-slate-200"}`} />
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isDark ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-xs font-bold ml-1 transition-colors duration-300 ${
                    isDark ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {isDark
                    ? t("settings.appearance.darkMode", { defaultValue: "Dark Mode" })
                    : t("settings.appearance.lightMode", { defaultValue: "Light Mode" })}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDark ? (
                  <Moon className="w-4 h-4 text-blue-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {isDark
                    ? t("settings.appearance.darkMode", { defaultValue: "Dark Mode" })
                    : t("settings.appearance.lightMode", { defaultValue: "Light Mode" })}
                </span>
              </div>
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 shrink-0 ${
                  isDark ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                    isDark ? "translate-x-7 bg-white" : "translate-x-0 bg-white"
                  }`}
                >
                  {isDark ? (
                    <Moon className="w-3 h-3 text-blue-600" />
                  ) : (
                    <Sun className="w-3 h-3 text-amber-500" />
                  )}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {t("settings.appearance.persistNote", {
                defaultValue: "Your theme preference is saved and applied automatically on your next visits.",
              })}
            </p>
          </div>

          {/* Khối Language */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-850 pb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{t("settings.language.sectionTitle", { defaultValue: "Language" })}</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {t("settings.language.description", {
                defaultValue: "Select your preferred language for the portal layout and notifications.",
              })}
            </p>
            <div className="flex gap-2">
              <button
                id="lang-en-btn"
                onClick={() => changeLanguage("en")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                  language === "en"
                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-300"
                }`}
              >
                <span className="text-base leading-none">🇺🇸</span>
                <span>English</span>
                {language === "en" && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                id="lang-vi-btn"
                onClick={() => changeLanguage("vi")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                  language === "vi"
                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-300"
                }`}
              >
                <span className="text-base leading-none">🇻🇳</span>
                <span>Tiếng Việt</span>
                {language === "vi" && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {t("settings.language.persistNote", {
                defaultValue: "Language settings are saved in your local preferences.",
              })}
            </p>
          </div>

          {/* Khối Quyền Riêng Tư (Privacy) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white border-b border-slate-50 dark:border-slate-850 pb-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{t("settings.privacy.sectionTitle", { defaultValue: "Privacy" })}</span>
            </div>
            <div className="space-y-1 text-xs font-bold text-slate-600 dark:text-slate-400">
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left">
                <span>{t("settings.privacy.downloadMyData", { defaultValue: "Download My Data" })}</span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left">
                <span>{t("settings.privacy.privacyPolicy", { defaultValue: "Privacy Policy" })}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left">
                <span>{t("settings.privacy.termsOfService", { defaultValue: "Terms of Service" })}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 transition text-left pt-2 border-t border-slate-50 dark:border-slate-800 mt-1">
                <span>{t("settings.privacy.deleteAccount", { defaultValue: "Delete Account" })}</span>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
