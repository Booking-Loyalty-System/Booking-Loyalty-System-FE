import React, { useState, useEffect } from "react";
import {
  User,
  Edit3,
  Lock,
  Bell,
  Check,
  X,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Globe,
  Eye,
  EyeOff,
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
  const { t, i18n } = useTranslation("customer");

  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSMSNotify] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Form state for Profile
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
  });

  // Form state for Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // States to toggle password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (customerMe && !isEditing) {
      setFormData({
        fullName: customerMe.fullName || user?.fullName || "",
        phoneNumber: customerMe.phoneNumber || "",
        dateOfBirth: customerMe.dateOfBirth
          ? new Date(customerMe.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [customerMe, user, isEditing]);

  const handleSave = async () => {
    const normalizedFullName = formData.fullName.trim();
    const normalizedPhone = formData.phoneNumber.trim();

    if (!normalizedFullName || !normalizedPhone) {
      toast.error(
        t("settings.toast.fillRequired", {
          defaultValue: "Vui lòng nhập đầy đủ họ tên và số điện thoại.",
        }),
      );
      return;
    }

    if (normalizedFullName.length > 100) {
      toast.error(
        t("settings.toast.fullNameTooLong", {
          defaultValue: "Họ và tên không được vượt quá 100 ký tự.",
        }),
      );
      return;
    }

    // Theo yêu cầu FE: số điện thoại dạng nội địa Việt Nam, đúng 10 chữ số.
    if (!/^0\d{9}$/.test(normalizedPhone)) {
      toast.error(
        t("settings.toast.invalidPhone", {
          defaultValue:
            "Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng 0.",
        }),
      );
      return;
    }

    if (formData.dateOfBirth) {
      const selectedDate = new Date(`${formData.dateOfBirth}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(selectedDate.getTime()) || selectedDate > today) {
        toast.error(
          t("settings.toast.invalidDob", {
            defaultValue: "Ngày sinh không hợp lệ hoặc nằm trong tương lai.",
          }),
        );
        return;
      }
    }

    try {
      // Ép chuẩn định dạng ngày tháng sang ISO 8601 để Backend C# parse thành DateTime.
      const formattedDate = formData.dateOfBirth
        ? `${formData.dateOfBirth}T00:00:00.000Z`
        : null;

      await updateCustomer({
        fullName: normalizedFullName,
        phoneNumber: normalizedPhone,
        dateOfBirth: formattedDate,
      });

      toast.success(
        t("settings.toast.updateSuccess", {
          defaultValue: "Profile updated successfully!",
        }),
      );
      setIsEditing(false);
    } catch (error) {
      toast.error(
        t("settings.toast.updateFailed", {
          defaultValue: "Failed to update profile. Please try again.",
        }),
      );
      console.error("Update profile error:", error);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: customerMe?.fullName || user?.fullName || "",
      phoneNumber: customerMe?.phoneNumber || "",
      dateOfBirth: customerMe?.dateOfBirth
        ? new Date(customerMe.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(
        t("settings.toast.fillPassword", {
          defaultValue: "Please fill in all password fields",
        }),
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        t("settings.toast.passwordLength", {
          defaultValue: "Mật khẩu mới phải có ít nhất 6 ký tự.",
        }),
      );
      return;
    }

    if (newPassword === currentPassword) {
      toast.error(
        t("settings.toast.passwordSameAsCurrent", {
          defaultValue: "Mật khẩu mới phải khác mật khẩu hiện tại.",
        }),
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        t("settings.toast.passwordMismatch", {
          defaultValue: "Mật khẩu xác nhận không khớp.",
        }),
      );
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      toast.success(
        t("settings.toast.passwordSuccess", {
          defaultValue: "Password updated successfully!",
        }),
      );
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        t("settings.toast.passwordFailed", {
          defaultValue:
            "Failed to change password. Please check your current password and try again.",
        }),
      );
      console.error("Change password error:", error);
    }
  };

  return (
    <div className="w-full font-sans text-slate-800 dark:text-slate-100">
      <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-6">
        {t("settings.subtitle", {
          defaultValue: "Manage your account information and preferences",
        })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* CỘT TRÁI + GIỮA (2/3): FORM CHÍNH */}
        <div className="lg:col-span-2 space-y-6">
          {/* Khối 1: Personal Information */}
          <div className="bg-white dark:bg-[#13151A] border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-blue-950 dark:text-white">
                <User className="w-5 h-5 text-blue-600" />
                <span>
                  {t("settings.personalInfo.sectionTitle", {
                    defaultValue: "Personal Information",
                  })}
                </span>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 border-2 border-blue-600 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>
                    {t("settings.personalInfo.btnEdit", {
                      defaultValue: "Edit",
                    })}
                  </span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-1 border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>
                      {t("settings.personalInfo.btnCancel", {
                        defaultValue: "Cancel",
                      })}
                    </span>
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
                    <span>
                      {t("settings.personalInfo.btnSave", {
                        defaultValue: "Save",
                      })}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.personalInfo.labelFullName", {
                    defaultValue: "Full Name",
                  })}
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
                  maxLength={100}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none transition-colors ${
                    isEditing
                      ? "bg-white dark:bg-black/20 border-blue-300 dark:border-blue-500 text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                      : "bg-slate-50/70 dark:bg-white/5 border-slate-200/60 dark:border-white/5 text-slate-800 dark:text-slate-400"
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.personalInfo.labelPhoneNumber", {
                    defaultValue: "Phone Number",
                  })}
                </label>
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={
                    isEditing
                      ? formData.phoneNumber
                      : customerMe?.phoneNumber || ""
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    }))
                  }
                  inputMode="numeric"
                  maxLength={10}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none transition-colors ${
                    isEditing
                      ? "bg-white dark:bg-black/20 border-blue-300 dark:border-blue-500 text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                      : "bg-slate-50/70 dark:bg-white/5 border-slate-200/60 dark:border-white/5 text-slate-800 dark:text-slate-400"
                  }`}
                />
              </div>

              {/* Input Date Of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.personalInfo.labelDateOfBirth", {
                    defaultValue: "Date of Birth",
                  })}
                </label>
                <input
                  type="date"
                  readOnly={!isEditing}
                  value={formData.dateOfBirth}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dateOfBirth: e.target.value,
                    }))
                  }
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none transition-colors ${
                    isEditing
                      ? "bg-white dark:bg-black/20 border-blue-300 dark:border-blue-500 text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                      : "bg-slate-50/70 dark:bg-white/5 border-slate-200/60 dark:border-white/5 text-slate-800 dark:text-slate-400 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.personalInfo.labelEmailAddress", {
                    defaultValue: "Email Address",
                  })}{" "}
                  <span className="normal-case text-[10px] text-slate-400 font-medium">
                    {t("settings.personalInfo.emailReadOnly", {
                      defaultValue: "(Read-only)",
                    })}
                  </span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={customerMe?.email || user?.email || ""}
                  className="w-full bg-slate-50/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Khối 2: Password & Security */}
          <div className="bg-white dark:bg-[#13151A] border border-slate-100 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 font-bold text-base text-blue-950 dark:text-white border-b border-slate-50 dark:border-white/5 pb-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <span>
                {t("settings.passwordSecurity.sectionTitle", {
                  defaultValue: "Password & Security",
                })}
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.passwordSecurity.labelCurrentPassword", {
                    defaultValue: "Current Password",
                  })}
                </label>
                <input
                  type="password"
                  placeholder={t(
                    "settings.passwordSecurity.placeholderCurrentPassword",
                    { defaultValue: "Enter current password" },
                  )}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* New Password With Toggle */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.passwordSecurity.labelNewPassword", {
                    defaultValue: "New Password",
                  })}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder={t(
                      "settings.passwordSecurity.placeholderNewPassword",
                      { defaultValue: "Enter new password" },
                    )}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 rounded-xl px-4 py-2.5 pr-10 text-sm font-mono outline-none transition-all text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                  >
                    {showNewPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password With Toggle */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t("settings.passwordSecurity.labelConfirmNewPassword", {
                    defaultValue: "Confirm New Password",
                  })}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t(
                      "settings.passwordSecurity.placeholderConfirmNewPassword",
                      { defaultValue: "Confirm new password" },
                    )}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 rounded-xl px-4 py-2.5 pr-10 text-sm font-mono outline-none transition-all text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-bold w-full sm:w-auto px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
              >
                {isChangingPassword && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isChangingPassword
                  ? t("settings.passwordSecurity.btnUpdating", {
                      defaultValue: "Updating...",
                    })
                  : t("settings.passwordSecurity.btnUpdatePassword", {
                      defaultValue: "Update Password",
                    })}
              </button>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    {t("settings.passwordSecurity.twoFactorTitle", {
                      defaultValue: "Two-Factor Authentication",
                    })}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    {t("settings.passwordSecurity.twoFactorDesc", {
                      defaultValue:
                        "Add an extra layer of security to your account",
                    })}
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
          {/* Khối Thẻ Thành Viên Premium Dark */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-[#050505] dark:to-[#111] border border-blue-500/50 dark:border-white/10 text-white rounded-[2rem] p-6 shadow-xl group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-400/30 dark:group-hover:bg-blue-500/30 transition-colors duration-700"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-indigo-400/20 dark:bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-indigo-400/30 dark:group-hover:bg-indigo-500/30 transition-colors duration-700"></div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-blue-100 font-medium">
                    {t("settings.memberCard.memberSince", {
                      defaultValue: "Member Since",
                    })}
                  </p>
                  <p className="text-lg font-black tracking-wide">
                    {customerMe?.createdAt
                      ? new Date(customerMe.createdAt).toLocaleDateString(
                          i18n.language === "vi" ? "vi-VN" : "en-US",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "2026"}
                  </p>
                </div>
              </div>
              <div className="pt-2 space-y-2 text-sm font-semibold border-t border-white/10">
                <div className="flex justify-between opacity-90">
                  <span>
                    {t("settings.memberCard.totalBookings", {
                      defaultValue: "Total Bookings",
                    })}
                  </span>
                  <span className="font-bold">
                    {customerMe?.totalWashes ?? 0}
                  </span>
                </div>
                <div className="flex justify-between opacity-90">
                  <span>
                    {t("settings.memberCard.totalSpent", {
                      defaultValue: "Total Spent",
                    })}
                  </span>
                  <span className="font-bold">
                    {(customerMe?.totalSpent ?? 0).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span>
                    {t("settings.memberCard.pointsBalance", {
                      defaultValue: "Points Balance",
                    })}
                  </span>
                  <span className="text-base font-black text-amber-300">
                    {customerMe?.availablePoint ?? 0} point
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Khối Cấu Hình Notifications Tắt/Mở */}
          <div className="bg-white dark:bg-[#13151A] border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-950 dark:text-white border-b border-slate-50 dark:border-white/5 pb-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>
                {t("settings.notificationsSection.sectionTitle", {
                  defaultValue: "Notifications",
                })}
              </span>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {t("settings.notificationsSection.emailNotifications", {
                    defaultValue: "Email Notifications",
                  })}
                </span>
                <button
                  onClick={() => setEmailNotify(!emailNotify)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    emailNotify
                      ? "bg-blue-600"
                      : "bg-slate-200 dark:bg-slate-700"
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
                  {t("settings.notificationsSection.smsNotifications", {
                    defaultValue: "SMS Notifications",
                  })}
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
                  {t("settings.notificationsSection.marketingEmails", {
                    defaultValue: "Marketing Emails",
                  })}
                </span>
                <button
                  onClick={() => setMarketingEmail(!marketingEmail)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    marketingEmail
                      ? "bg-blue-600"
                      : "bg-slate-200 dark:bg-slate-700"
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
          <div className="bg-white dark:bg-[#13151A] border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-950 dark:text-white border-b border-slate-50 dark:border-white/5 pb-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              <span>
                {t("settings.appearance.sectionTitle", {
                  defaultValue: "Appearance",
                })}
              </span>
            </div>

            <div
              className={`relative rounded-xl overflow-hidden h-16 transition-all duration-500 ${
                isDark
                  ? "bg-black/20 border border-white/5"
                  : "bg-gradient-to-br from-slate-55 to-blue-50"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isDark
                      ? "bg-slate-600 text-slate-300"
                      : "bg-white text-amber-500 shadow-sm"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div
                  className={`h-5 w-px ${
                    isDark ? "bg-slate-600" : "bg-slate-200"
                  }`}
                />
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isDark
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-400"
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
                    ? t("settings.appearance.darkMode", {
                        defaultValue: "Dark Mode",
                      })
                    : t("settings.appearance.lightMode", {
                        defaultValue: "Light Mode",
                      })}
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
                    ? t("settings.appearance.darkMode", {
                        defaultValue: "Dark Mode",
                      })
                    : t("settings.appearance.lightMode", {
                        defaultValue: "Light Mode",
                      })}
                </span>
              </div>
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#13151A] shrink-0 ${
                  isDark ? "bg-blue-600" : "bg-slate-200 dark:bg-white/10"
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
                defaultValue:
                  "Your theme preference is saved and applied automatically on your next visits.",
              })}
            </p>
          </div>

          {/* Khối Language */}
          <div className="bg-white dark:bg-[#13151A] border border-slate-100 dark:border-white/5 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-950 dark:text-white border-b border-slate-50 dark:border-white/5 pb-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>
                {t("settings.language.sectionTitle", {
                  defaultValue: "Language",
                })}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {t("settings.language.description", {
                defaultValue:
                  "Select your preferred language for the portal layout and notifications.",
              })}
            </p>
            <div className="flex gap-2">
              <button
                id="lang-en-btn"
                onClick={() => changeLanguage("en")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${
                  language === "en"
                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                    : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-white/20 dark:bg-black/20"
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
                    : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-white/20 dark:bg-black/20"
                }`}
              >
                <span className="text-base leading-none">🇻🇳</span>
                <span>Tiếng Việt</span>
                {language === "vi" && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {t("settings.language.persistNote", {
                defaultValue:
                  "Language settings are saved in your local preferences.",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
