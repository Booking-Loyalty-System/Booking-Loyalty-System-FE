import React, { useEffect, useState } from "react";
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
        setProfileError("Không thể tải thông tin nhân viên.");
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

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("Mật khẩu mới phải khác mật khẩu hiện tại.");
      return;
    }

    try {
      setChangingPassword(true);

      await apiClient.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setPasswordSuccess("Đổi mật khẩu thành công.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);

      setPasswordError(
        "Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-slate-500 font-semibold">
          Đang tải thông tin...
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="rounded-3xl bg-red-50 border border-red-100 p-6 text-red-600">
        {profileError || "Không tìm thấy thông tin nhân viên."}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Xem thông tin tài khoản và quản lý mật khẩu của bạn.
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
                    {profile.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                <p className="text-slate-500 text-sm mt-1">{profile.role}</p>
              </div>
            </div>
          </div>

          <div className="p-7">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-6">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ProfileItem
                icon={<UserRound className="w-5 h-5" />}
                label="Full Name"
                value={profile.fullName}
              />

              <ProfileItem
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value={profile.email}
              />

              <ProfileItem
                icon={<Phone className="w-5 h-5" />}
                label="Phone Number"
                value={profile.phoneNumber || "Chưa cập nhật"}
              />

              <ProfileItem
                icon={<ShieldCheck className="w-5 h-5" />}
                label="Role"
                value={profile.role}
              />

              <ProfileItem
                icon={<Building2 className="w-5 h-5" />}
                label="Branch"
                value={profile.branch?.branchName || "Chưa phân chi nhánh"}
              />

              <ProfileItem
                icon={<Building2 className="w-5 h-5" />}
                label="Branch Address"
                value={profile.branch?.address || "Chưa có địa chỉ"}
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
                  Change Password
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Cập nhật mật khẩu tài khoản
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="p-7 space-y-5">
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrentPassword}
              onToggle={() => setShowCurrentPassword((previous) => !previous)}
            />

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNewPassword}
              onToggle={() => setShowNewPassword((previous) => !previous)}
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
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
              {changingPassword ? "Đang cập nhật..." : "Change Password"}
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
  show: boolean;
  onToggle: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
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
          className="w-full h-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 pr-12 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default StaffProfile;
