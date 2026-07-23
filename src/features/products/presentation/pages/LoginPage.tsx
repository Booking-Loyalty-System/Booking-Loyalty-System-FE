import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Lock, Droplets, Eye, EyeOff, Sun, Moon, ArrowRight } from "lucide-react";
import { useAuth } from "../../application/useAuth.ts";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { CarScene } from "@/shared/car-scene.tsx";
import { toast } from "sonner";
import { useTheme } from '@/core/context/ThemeContext.tsx';
import { useLanguage } from '@/core/context/LanguageContext.tsx';
import { jwtDecode } from "jwt-decode";

export const LoginPage: React.FC = () => {
  const { t } = useTranslation('customer');
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });

      const savedUser = localStorage.getItem("user_info");
      const user = savedUser ? JSON.parse(savedUser) : null;
      console.log("user in login page", user);
      toast.success(t("auth.login.toastSuccess", { defaultValue: "Đăng nhập thành công!" }));

      setTimeout(() => {
        if (user?.role === "Admin") {
          navigate("/admin");
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

  const handleGoogleSuccess = async (tokenResponse: { code: string }) => {
    const authCode = tokenResponse.code;
    console.log("Google Authorization Code thành công:", authCode);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google-login?code=${encodeURIComponent(authCode)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        const responseData = await response.json();
        const authData = responseData.data;

        if (authData && authData.accessToken) {
          localStorage.setItem("access_token", authData.accessToken);
          if (authData.refreshToken) {
            localStorage.setItem("refresh_token", authData.refreshToken);
          }

          // Parse and decode token to mirror standard auth logic
          try {
            const decoded = jwtDecode<any>(authData.accessToken);

            const tokenData = {
              userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null,
              email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || null,
              role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null,
              exp: decoded.exp || null,
              iss: decoded.iss || null,
              aud: decoded.aud || null,
            };
            localStorage.setItem("token_data", JSON.stringify(tokenData));

            const synthesizedUser = {
              id: tokenData.userId || "",
              email: tokenData.email || "",
              role: tokenData.role || "Customer",
              fullName: decoded.fullName || "",
            };
            localStorage.setItem("user_info", JSON.stringify(synthesizedUser));
          } catch (jwtErr) {
            console.error("Lỗi decode JWT token từ Google:", jwtErr);
          }

          alert(t("auth.login.toastGoogleSuccess", { defaultValue: "Đăng nhập bằng Google thành công!" }));
          navigate("/dashboard");
        } else {
          alert(t("auth.login.toastGoogleBackendFail", { defaultValue: "Không nhận được access token từ backend." }));
        }
      } else {
        alert(t("auth.login.toastGoogleBackendFail", { defaultValue: "Backend xác thực Google code thất bại." }));
      }
    } catch (err) {
      console.error("Lỗi kết nối API Backend:", err);
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => console.log("Google Đăng nhập thất bại"),
    flow: "auth-code",
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
    <div className="min-h-screen w-full bg-[hsl(210,92%,91%)] dark:bg-[#0B0C10] flex flex-col p-4 md:p-6 antialiased font-sans overflow-y-auto relative transition-colors duration-300">

      {/* 🌊 Aqua Premium Background — light mode only */}
      <div className="fixed inset-0 pointer-events-none z-0 dark:hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-sky-400/80 via-blue-200/40 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute -bottom-32 -right-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-cyan-400/70 via-sky-200/30 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '3s' }} />
        <div className="absolute inset-0 opacity-55" style={{ backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.12) 1px, transparent 1px)', backgroundSize: '36px 36px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />
      </div>
      {/* Dark mode orbs */}
      <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-lighten animate-pulse"></div>
      <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-lighten animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Theme & Language Switchers */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex items-center justify-center p-3 rounded-full border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-md"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
        </button>

        <button
          onClick={toggleLanguage}
          title={language === 'en' ? "Switch to Vietnamese" : "Switch to English"}
          className="flex items-center gap-1.5 px-4 py-3 rounded-full font-bold text-xs border border-slate-200/50 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-md"
        >
          <span className="text-sm leading-none">{language === 'en' ? '🇺🇸' : '🇻🇳'}</span>
          <span className="uppercase tracking-widest">{language === 'en' ? 'EN' : 'VI'}</span>
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-[1200px] mx-auto bg-transparent flex flex-col lg:flex-row gap-8 relative z-10">

          {/* PANEL TRÁI: GIỚI THIỆU TÍNH NĂNG */}
          <div className="flex-1 bg-white/75 dark:bg-[#13151A]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 flex flex-col shadow-[0_8px_40px_rgba(14,165,233,0.10)] dark:shadow-black/50 border border-sky-200/50 dark:border-white/5 transition-colors duration-300">
            <div className="flex flex-col h-full justify-center">
              {/* LOGO & BRANDING */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
                    {t('auth.login.appName')}
                  </h1>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    {t('auth.login.appTagline')}
                  </p>
                </div>
              </div>

              {/* BANNER 3D SCENE */}
              <div className="w-full overflow-hidden rounded-[2rem] mb-8 aspect-video max-h-64 border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/50 shadow-inner">
                <CarScene />
              </div>

              {/* DANH SÁCH TÍNH NĂNG NỔI BẬT */}
              <div className="space-y-6">
                {[
                  { title: t('auth.login.feature1Title'), desc: t('auth.login.feature1Desc') },
                  { title: t('auth.login.feature2Title'), desc: t('auth.login.feature2Desc') },
                  { title: t('auth.login.feature3Title'), desc: t('auth.login.feature3Desc') }
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-[1rem] bg-slate-100 dark:bg-white/5 text-blue-600 dark:text-blue-400 font-black text-xl flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm border border-slate-200/50 dark:border-white/5">
                      {idx + 1}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-extrabold text-blue-950 dark:text-white text-base">
                        {feat.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PANEL PHẢI: FORM ĐĂNG NHẬP */}
          <div className="flex-[0.8] bg-white/85 dark:bg-[#13151A]/90 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center shadow-[0_8px_40px_rgba(14,165,233,0.10)] dark:shadow-black/50 border border-sky-200/50 dark:border-white/5 transition-colors duration-300">
            <div className="w-full max-w-md mx-auto">
              {/* TIÊU ĐỀ FORM */}
              <div className="mb-10">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white mb-2 tracking-tight">
                  {t('auth.login.formHeading')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {t('auth.login.formSubtitle')}
                </p>
              </div>

              {/* KHU VỰC FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    {t('auth.login.labelEmail')}
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.login.placeholderEmail')}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-base text-blue-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* MẬT KHẨU */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    {t('auth.login.labelPassword')}
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-base text-blue-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* GHI NHỚ & QUÊN MẬT KHẨU */}
                <div className="flex items-center justify-between text-sm pt-2">
                  <label className="flex items-center gap-3 text-slate-600 dark:text-slate-400 cursor-pointer select-none font-semibold">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-blue-500 dark:bg-white/5 focus:ring-blue-500 transition-all"
                    />
                    {t('auth.login.checkboxRememberMe')}
                  </label>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-colors">
                    {t('auth.login.linkForgotPassword')}
                  </a>
                </div>

                {/* LỖI ĐĂNG NHẬP */}
                {error && (
                  <div className="text-sm text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 rounded-2xl font-bold flex items-center gap-2">
                    {t('auth.login.toastFailed', { defaultValue: "Đăng nhập thất bại. Vui lòng thử lại!" })}
                  </div>
                )}

                {/* NÚT SIGN IN */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-2xl hover:shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all text-base mt-4 flex items-center justify-center gap-2 group border border-white/10"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t('auth.login.btnSignIn')}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* DIVIDER */}
                <div className="flex items-center gap-4 py-4">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
                </div>

                {/* NÚT GOOGLE */}
                <button
                  type="button"
                  onClick={() => triggerGoogleLogin()}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold py-3.5 px-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 hover:shadow-md transition-all text-base flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13.2s5.48 12.2 12.24 12.2c7.055 0 11.75-4.943 11.75-11.914 0-.806-.088-1.423-.192-2.2H12.24z" />
                  </svg>
                  {t('auth.login.btnSignInWithGoogle')}
                </button>

                {/* CHUYỂN TRANG ĐĂNG KÝ */}
                <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 pt-4">
                  {t('auth.login.noAccount')}{" "}
                  <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-extrabold underline-offset-4 hover:underline transition-all">
                    {t('auth.login.linkCreateAccount')}
                  </Link>
                </div>
              </form>

              {/* QUICK ACCESS (DEMO) */}
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                  {t('auth.login.quickAccessLabel')}
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {['customer', 'staff', 'admin'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleQuickAccess(role as any)}
                      className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-xs py-2 px-3 rounded-xl transition-colors uppercase tracking-wider"
                    >
                      {t(`auth.login.quickAccess${role.charAt(0).toUpperCase() + role.slice(1)}` as any)}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>
    </div>
  );
};
