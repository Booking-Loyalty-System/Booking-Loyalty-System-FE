import React, { useState } from "react";
import { Mail, Lock, Droplets, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../application/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { CarScene } from "@/shared/car-scene.tsx";
import { toast } from "sonner";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Chạy login để kích hoạt onSuccess lưu token & user_info vào localStorage
      await login({ email, password });

      const savedUser = localStorage.getItem("user_info");
      const user = savedUser ? JSON.parse(savedUser) : null;
      console.log("user in login page", user);
      toast.success("Đăng nhập thành công!");

      setTimeout(() => {
        // 3. Check role trên biến user sạch này là chuẩn 100%
        if (user?.role === "Admin") {
          navigate("/admin"); // 🌟 Thêm đường dẫn tới trang Admin của bạn ở đây
        } else if (user?.role === "Staff") {
          navigate("/staff/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (err) {
      console.error("Đăng nhập email thất bại:", err);
    }
  };

  // 🌟 Hàm xử lý khi lấy thành công 'code' từ phía Google
  const handleGoogleSuccess = async (tokenResponse: { code: string }) => {
    const authCode = tokenResponse.code;
    console.log("Google Authorization Code thành công:", authCode);

    try {
      // 🔥 Truyền code trực tiếp vào URL parameters gửi lên API .NET Core
      const response = await fetch(
        `https://localhost:7001/api/auth/google-login?code=${encodeURIComponent(authCode)}`,
        {
          method: "POST", // Giữ POST hoặc đổi sang GET tùy theo cấu hình Endpoint [HttpPost] hay [HttpGet] ở Backend
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.token); // Lưu token hệ thống cấp phát
        alert("Đăng nhập bằng Google thành công!");
        navigate("/auto-wash-simulation");
        // window.location.href = '/dashboard';
      } else {
        alert("Backend xác thực Google code thất bại.");
      }
    } catch (err) {
      console.error("Lỗi kết nối API Backend:", err);
    }
  };

  // 🌟 Khởi tạo trigger Login thông qua Hook
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.log("Google Đăng nhập thất bại"),
    flow: "auth-code", // 🔥 Bắt buộc cấu hình flow này để nhận chuỗi 'code' thay vì idToken
  });

  const handleQuickAccess = (role: "customer" | "staff" | "admin") => {
    const credentials = {
      customer: { email: "customer@autowash.com", pass: "12345678" },
      staff: { email: "staff@autowash.com", pass: "12345678" },
      admin: { email: "admin@autowash.com", pass: "12345678" },
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].pass);
  };

  return (
    <div className="min-h-screen w-full bg-[#e6f0fa] flex flex-col p-4 md:p-6 antialiased font-sans overflow-y-auto">
      <div className="flex-grow"></div>
      <div className="w-full max-w-6xl mx-auto bg-transparent flex flex-col lg:flex-row gap-5 h-auto">
        {/* PANEL TRÁI: GIỚI THIỆU TÍNH NĂNG */}
        <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 flex flex-col shadow-sm border border-white/40">
          <div className="flex flex-col h-full justify-center">
            {/* LOGO & BRANDING */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#4a90e2] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0f172a] leading-tight tracking-tight">
                  AutoWash Pro
                </h1>
                <p className="text-sm text-[#64748b] font-medium mt-0.5">
                  Smart Car Wash Management
                </p>
              </div>
            </div>

            {/* BANNER 3D SCENE */}
            <div className="w-full overflow-hidden rounded-xl mb-5 aspect-video max-h-64">
              <CarScene />
            </div>

            {/* DANH SÁCH TÍNH NĂNG NỔI BẬT */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#e6f0fa] text-[#1e6ffd] font-bold text-xl flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] text-base">
                    Easy Booking
                  </h3>
                  <p className="text-sm text-[#64748b] mt-0.5">
                    Schedule your car wash in seconds
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#e6f0fa] text-[#1e6ffd] font-bold text-xl flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] text-base">
                    Loyalty Rewards
                  </h3>
                  <p className="text-sm text-[#64748b] mt-0.5">
                    Earn points and get exclusive benefits
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#e6f0fa] text-[#1e6ffd] font-bold text-xl flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] text-base">
                    Premium Service
                  </h3>
                  <p className="text-sm text-[#64748b] mt-0.5">
                    Professional car care guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL PHẢI: FORM ĐĂNG NHẬP */}
        <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-start shadow-sm border border-white/40">
          <div className="w-full max-w-md mx-auto">
            {/* TIÊU ĐỀ FORM */}
            <div className="mb-5">
              <h2 className="text-3xl font-bold text-[#0f172a] mb-1 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-[#64748b] text-sm">
                Sign in to your account to continue
              </p>
            </div>

            {/* KHU VỰC FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-base font-semibold text-[#334155]">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94a3b8]">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#e2e8f0] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] transition-all"
                  />
                </div>
              </div>

              {/* MẬT KHẨU */}
              <div className="space-y-1.5">
                <label className="text-base font-semibold text-[#334155]">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94a3b8]">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"} // 🌟 Thay đổi kiểu input dựa trên state
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2 bg-white border border-[#e2e8f0] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] transition-all"
                  />
                  {/* 🌟 Nút bấm ẩn/hiện mật khẩu */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#94a3b8] hover:text-[#4a90e2] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* GHI NHỚ & QUÊN MẬT KHẨU */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center gap-2 text-[#475569] cursor-pointer select-none font-medium">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#cbd5e1] text-[#4a90e2] focus:ring-[#4a90e2]"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-[#4a90e2] hover:underline font-semibold"
                >
                  Forgot password?
                </a>
              </div>

              {/* LỖI ĐĂNG NHẬP */}
              {error && (
                <div className="text-xs text-red-500 bg-red-50 border border-red-100 p-2 rounded-lg font-medium">
                  Đăng nhập thất bại. Vui lòng thử lại!
                </div>
              )}

              {/* NÚT SIGN IN THƯỜNG */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4a90e2] disabled:bg-[#a3c7f5] text-white font-semibold py-2 px-4 rounded-xl hover:bg-[#357abd] active:scale-[0.99] transition-all text-sm shadow-sm mt-1 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* 🌟 NÚT GOOGLE CUSTOM MỚI (Đồng bộ thiết kế UI với form và gọi trigger hook) */}
              <button
                type="button"
                onClick={() => triggerGoogleLogin()}
                className="w-full bg-white border border-[#e2e8f0] text-[#334155] font-semibold py-2 px-4 rounded-xl hover:bg-[#f8fafc] active:scale-[0.99] transition-all text-sm shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13.2s5.48 12.2 12.24 12.2c7.055 0 11.75-4.943 11.75-11.914 0-.806-.088-1.423-.192-2.2H12.24z"
                  />
                </svg>
                Sign in with Google
              </button>

              {/* CHUYỂN TRANG ĐĂNG KÝ */}
              <div className="text-center text-sm text-[#475569] pt-1">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#4a90e2] hover:underline font-semibold"
                >
                  Create Account
                </Link>
              </div>
            </form>

            <div className="border-t border-[#f1f5f9] my-4"></div>

            {/* QUICK ACCESS (DEMO) */}
            <div className="text-center">
              <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider block mb-2">
                Quick Access (Demo)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickAccess("customer")}
                  className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAccess("staff")}
                  className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors"
                >
                  Staff
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAccess("admin")}
                  className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>
    </div>
  );
};
