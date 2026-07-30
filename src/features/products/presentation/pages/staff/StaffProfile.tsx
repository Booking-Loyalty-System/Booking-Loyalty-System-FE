import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { apiClient } from "@/core/api/apiClient";

interface Branch {
  id: string;
  branchName: string;
  address: string;
  hotline: string;
}

interface StaffProfileData {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isAvailable: boolean;
  role: string;
  branch: Branch | null;
}

export const StaffProfile: React.FC = () => {
  const { t } = useTranslation("customer");
  const [profile, setProfile] = useState<StaffProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setProfileError("");

        const response = await apiClient.get("/staff/profile");

        // Swagger của bạn trả:
        // {
        //   success: true,
        //   message: "...",
        //   data: {...}
        // }
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch staff profile:", error);
        setProfileError(t("staffProfile.fetchProfileError"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    const errors: typeof fieldErrors = {};

    if (!currentPassword) {
      errors.currentPassword = "Mật khẩu hiện tại không được để trống.";
    }

    if (!newPassword) {
      errors.newPassword = "Mật khẩu mới không được để trống.";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    } else if (currentPassword && currentPassword === newPassword) {
      errors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng nhập lại mật khẩu mới.";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setChangingPassword(true);

      await apiClient.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(t("staffProfile.password.success"));

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFieldErrors({});
    } catch (error) {
      console.error("Failed to change password:", error);

      setPasswordError(t("staffProfile.password.fail"));
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-slate-500 font-semibold">
          {t("staffProfile.loading")}
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="rounded-3xl bg-red-50 border border-red-100 p-6 text-red-600">
        {profileError || t("staffProfile.notFound")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {t("staffProfile.title")}
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("staffProfile.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile information */}
        <div className="xl:col-span-2 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200/70 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="p-7 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <UserRound className="w-9 h-9 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {profile.fullName}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      profile.isAvailable
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {profile.isAvailable
                      ? t("staffProfile.status.available")
                      : t("staffProfile.status.unavailable")}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-1">{profile.role}</p>
              </div>
            </div>
          </div>

          <div className="p-7">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-6">
              {t("staffProfile.personalInfo.title")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ProfileItem
                icon={<UserRound className="w-5 h-5" />}
                label={t("")}
                value={profile.fullName}
              />

              <ProfileItem
                icon={<Mail className="w-5 h-5" />}
                label={t("")}
                value={profile.email}
              />

              <ProfileItem
                icon={<Phone className="w-5 h-5" />}
                label={t("")}
                value={
                  profile.phoneNumber ||
                  t("staffProfile.personalInfo.notUpdated")
                }
              />

              <ProfileItem
                icon={<ShieldCheck className="w-5 h-5" />}
                label={t("")}
                value={profile.role}
              />

              <ProfileItem
                icon={<Building2 className="w-5 h-5" />}
                label={t("")}
                value={
                  profile.branch?.branchName ||
                  t("staffProfile.personalInfo.noBranch")
                }
              />

              <ProfileItem
                icon={<Building2 className="w-5 h-5" />}
                label={t("")}
                value={
                  profile.branch?.address ||
                  t("staffProfile.personalInfo.noAddress")
                }
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200/70 dark:border-white/5 shadow-sm">
          <div className="p-7 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-black text-slate-900 dark:text-white">
                  {t("staffProfile.password.title")}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  {t("staffProfile.password.subtitle")}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleChangePassword}
            noValidate
            className="p-7 space-y-5"
          >
            <PasswordInput
              label={t("")}
              value={currentPassword}
              onChange={(value) => {
                setCurrentPassword(value);
                setFieldErrors((prev) => ({
                  ...prev,
                  currentPassword: undefined,
                }));
              }}
              error={fieldErrors.currentPassword}
              show={showCurrentPassword}
              onToggle={() => setShowCurrentPassword((previous) => !previous)}
            />

            <PasswordInput
              label={t("")}
              value={newPassword}
              onChange={(value) => {
                setNewPassword(value);
                setFieldErrors((prev) => ({
                  ...prev,
                  newPassword: undefined,
                  confirmPassword: undefined,
                }));
              }}
              error={fieldErrors.newPassword}
              show={showNewPassword}
              onToggle={() => setShowNewPassword((previous) => !previous)}
            />

            <PasswordInput
              label={t("")}
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setFieldErrors((prev) => ({
                  ...prev,
                  confirmPassword: undefined,
                }));
              }}
              error={fieldErrors.confirmPassword}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((previous) => !previous)}
            />

            {passwordError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-2xl p-3">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium rounded-2xl p-3">
                {passwordSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPassword
                ? t("staffProfile.password.updating")
                : t("staffProfile.password.button")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-blue-600 shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200 break-words">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  show: boolean;
  onToggle: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  error,
  show,
  onToggle,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={Boolean(error)}
          className={`w-full h-12 rounded-2xl border bg-white dark:bg-white/[0.03] px-4 pr-12 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 transition ${
            error
              ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
              : "border-slate-200 dark:border-white/10 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm font-semibold text-rose-500 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default StaffProfile;
