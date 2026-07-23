import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  User,
  Phone,
  Lock,
  Droplets,
  CheckCircle2,
  Mail,
  Calendar,
  KeyRound,
  Sun,
  Moon,
  ArrowRight,
  Award,
  X,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/features/products/application/useAuth.ts";
import { auth } from "@/firebase-config.ts";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/core/context/ThemeContext.tsx";
import { useLanguage } from "@/core/context/LanguageContext.tsx";

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation("customer");
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  // === EMAIL FORM STATES ===
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // === OTP POPUP STATES ===
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string>("");
  const [emailOtp, setEmailOtp] = useState("");
  const [otpInputs, setOtpInputs] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { register, verifyEmail, registerWithPhone, isPending, isPendingPhone, isPendingVerify } = useAuth();
  const [registerMode, setRegisterMode] = useState<"email" | "phone">("email");

  // === PHONE OTP (Firebase) STATES ===
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(
    null,
  );

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // === OTP INPUT HANDLER (cho 6 ô nhập riêng) ===
  const handleOtpInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Chỉ chấp nhận số
    const newInputs = [...otpInputs];
    newInputs[index] = value.slice(-1); // Chỉ lấy 1 ký tự cuối
    setOtpInputs(newInputs);
    setEmailOtp(newInputs.join(""));

    // Auto focus ô tiếp theo
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newInputs = [...otpInputs];
    pasted.split("").forEach((char, i) => {
      newInputs[i] = char;
    });
    setOtpInputs(newInputs);
    setEmailOtp(newInputs.join(""));
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // === SUBMIT EMAIL REGISTER (Bước 1) ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("auth.register.toastPasswordMismatch", { defaultValue: "Mật khẩu xác nhận không khớp!" }));
      return;
    }
    try {
      const userId = await register({
        email,
        password,
        fullName,
        phoneNumber: phoneNumber || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined,
      });

      // Lưu userId để dùng ở bước verify
      setPendingUserId(userId);

      // Hiển thị popup nhập OTP
      setShowOtpModal(true);
      toast.success(t("auth.register.toastSuccess", { defaultValue: "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP." }));
    } catch (error: any) {
      console.error("Đăng ký email thất bại:", error);
      if (error?.response?.status === 409) {
        toast.error(t("auth.register.toastEmailExist", { defaultValue: "Email này đã được đăng ký rồi." }));
      } else {
        toast.error(t("auth.register.toastFailed", { defaultValue: "Đăng ký thất bại, vui lòng thử lại." }));
      }
    }
  };

  // === SUBMIT OTP VERIFY (Bước 2) ===
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = emailOtp;
    if (otpCode.length !== 6) {
      toast.error(t("auth.register.toastOtpInvalid", { defaultValue: "Vui lòng nhập đủ 6 chữ số OTP." }));
      return;
    }
    try {
      await verifyEmail({
        id: pendingUserId,
        otpCode,
      });
      toast.success(t("auth.register.toastOtpSuccess", { defaultValue: "Xác thực email thành công! Chào mừng bạn!" }));
      setShowOtpModal(false);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Xác thực OTP thất bại:", error);
      toast.error(t("auth.register.toastOtpInvalid", { defaultValue: "Mã OTP không chính xác hoặc đã hết hạn!" }));
    }
  };

  // === PHONE REGISTER (Firebase) ===
  const setupRecaptcha = () => {
    if (!recaptchaVerifierRef.current && recaptchaContainerRef.current && auth) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        recaptchaContainerRef.current,
        { size: "visible" },
      );
    }
  };

  const handleSendOTP = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!phoneNumber) return toast.warning(t("auth.register.toastPhoneRequired", { defaultValue: "Vui lòng nhập số điện thoại" }));

    try {
      setupRecaptcha();
      const appVerifier = recaptchaVerifierRef.current;
      if (!appVerifier) {
        toast.error(t("auth.register.toastRecaptchaError", { defaultValue: "Không thể khởi tạo bộ xác thực reCaptcha." }));
        return;
      }
      const formattedPhone = phoneNumber.startsWith("0") ? "+84" + phoneNumber.slice(1) : phoneNumber;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmResult(result);
      setIsOtpSent(true);
      toast.success(t("auth.register.toastOtpSent", { defaultValue: "Đã gửi mã OTP thành công!" }));
    } catch (error) {
      const err = error as Error;
      console.error("Lỗi gửi OTP:", err);
      toast.error(t("auth.register.toastOtpSendFail", { defaultValue: "Không thể gửi OTP: " }) + err.message);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !confirmResult) return;
    try {
      const result = await confirmResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();
      const verifiedPhone = user.phoneNumber ?? phoneNumber;
      await registerWithPhone({ phoneNumber: verifiedPhone, idToken: idToken });
      toast.success(t("auth.register.toastOtpSuccess", { defaultValue: "Xác thực OTP thành công! Đang đăng nhập..." }));
      navigate("/dashboard");
    } catch (error) {
      console.error("Sai OTP hoặc lỗi server:", error);
      toast.error(t("auth.register.toastOtpInvalid", { defaultValue: "Mã OTP không chính xác hoặc đăng ký thất bại!" }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[hsl(210,92%,91%)] dark:bg-[#0B0C10] flex flex-col p-4 md:p-6 antialiased font-sans overflow-y-auto relative transition-colors duration-300">
      
      {/* 🌊 Aqua Premium Background — light mode only */}
      <div className="fixed inset-0 pointer-events-none z-0 dark:hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-sky-400/80 via-blue-200/40 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute -bottom-32 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-400/70 via-sky-200/30 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '13s', animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-55" style={{ backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.12) 1px, transparent 1px)', backgroundSize: '36px 36px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />
      </div>
      {/* Dark mode orbs */}
      <div className="hidden dark:block absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-lighten animate-pulse"></div>
      <div className="hidden dark:block absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-lighten animate-pulse" style={{ animationDelay: '1s' }}></div>

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

      <div className="flex-grow flex items-center justify-center py-10">
        <div className="w-full max-w-[1200px] mx-auto bg-transparent flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* PANEL TRÁI: GIỚI THIỆU THÀNH VIÊN */}
          <div className="flex-[0.9] bg-white/75 dark:bg-[#13151A]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-center shadow-[0_8px_40px_rgba(14,165,233,0.10)] dark:shadow-black/50 border border-sky-200/50 dark:border-white/5 transition-colors duration-300">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
                    {t('auth.register.appName')}
                  </h1>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    {t('auth.register.appTagline')}
                  </p>
                </div>
              </div>
              
              <div className="w-full overflow-hidden rounded-[2rem] mb-10 aspect-[16/9] max-h-[300px] border border-slate-100 dark:border-white/5 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000"
                  alt="Car Wash Foam"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl p-8 border border-emerald-100/50 dark:border-emerald-500/10">
                <h3 className="font-extrabold text-blue-950 dark:text-white text-xl mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-emerald-500" />
                  {t('auth.register.membershipBenefitsTitle')}
                </h3>
                <ul className="space-y-4">
                  {[
                    t('auth.register.benefit1'),
                    t('auth.register.benefit2'),
                    t('auth.register.benefit3'),
                    t('auth.register.benefit4')
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 bg-emerald-100 dark:bg-emerald-900/50 rounded-full p-1" />
                      <span className="text-base font-semibold text-slate-700 dark:text-slate-300 pt-0.5">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* PANEL PHẢI: FORM ĐĂNG KÝ */}
          <div className="flex-[1.1] bg-white/85 dark:bg-[#13151A]/90 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-start shadow-[0_8px_40px_rgba(14,165,233,0.10)] dark:shadow-black/50 border border-sky-200/50 dark:border-white/5 transition-colors duration-300">
            <div className="w-full max-w-lg mx-auto">
              <div className="mb-8">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white mb-2 tracking-tight">
                  {t('auth.register.formHeading')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {t('auth.register.formSubtitle')}
                </p>
              </div>

              {/* TABS */}
              <div className="flex p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl mb-8 border border-slate-200/50 dark:border-white/5">
                <button
                  onClick={() => setRegisterMode('email')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    registerMode === 'email'
                      ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400 border border-slate-200/50 dark:border-white/20'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {t('auth.register.tabEmail', { defaultValue: "Bằng Email" })}
                </button>
                <button
                  onClick={() => setRegisterMode('phone')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    registerMode === 'phone'
                      ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-blue-400 border border-slate-200/50 dark:border-white/20'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {t('auth.register.tabPhone', { defaultValue: "Bằng SĐT (OTP)" })}
                </button>
              </div>

              {registerMode === 'email' && (
                <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField icon={<User />} label={t('auth.register.labelFullName')} value={fullName} onChange={setFullName} placeholder="John Doe" />
                    <InputField icon={<Phone />} label={t('auth.register.labelPhoneNumber')} value={phoneNumber} onChange={setPhoneNumber} placeholder="0912345678" />
                  </div>
                  <InputField icon={<Mail />} label={t('auth.register.labelEmail')} value={email} onChange={setEmail} placeholder="john@example.com" type="email" />
                  <InputField icon={<Calendar />} label={t('auth.register.labelDOB')} value={dateOfBirth} onChange={setDateOfBirth} type="date" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField icon={<Lock />} label={t('auth.register.labelPassword')} value={password} onChange={setPassword} type="password" placeholder="••••••••" />
                    <InputField icon={<Lock />} label={t('auth.register.labelConfirmPassword')} value={confirmPassword} onChange={setConfirmPassword} type="password" placeholder="••••••••" />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2 group border border-white/10"
                  >
                    {isPending ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        {t('auth.register.btnCreateAccount')}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {registerMode === 'phone' && (
                <form onSubmit={handlePhoneSubmit} className="space-y-5 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      {t('auth.register.labelPhoneNumber')}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1 group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                          <Phone className="w-5 h-5" />
                        </span>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+84 901 234 567"
                          disabled={isOtpSent}
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-base text-blue-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium disabled:opacity-60"
                        />
                      </div>
                      {!isOtpSent && (
                        <button
                          onClick={handleSendOTP}
                          className="bg-slate-900 dark:bg-white/10 text-white dark:text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-white/20 whitespace-nowrap shadow-md transition-all hover:scale-105 dark:border dark:border-white/20"
                        >
                          {t('auth.register.sendCode', { defaultValue: "Gửi mã" })}
                        </button>
                      )}
                    </div>
                  </div>

                  <div ref={recaptchaContainerRef} className="my-4"></div>

                  {isOtpSent && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <InputField
                        icon={<KeyRound />}
                        label={t('auth.register.labelOtp', { defaultValue: "Mã OTP" })}
                        value={otp}
                        onChange={setOtp}
                        placeholder={t('auth.register.placeholderOtp', { defaultValue: "Nhập 6 số OTP..." })}
                        type="text"
                      />
                      <button
                        type="submit"
                        disabled={isPendingPhone}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 mt-6 flex items-center justify-center gap-2 group border border-white/10"
                      >
                        {isPendingPhone ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            {t('auth.register.confirmAndRegister', { defaultValue: "Xác nhận & Đăng ký" })}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              )}

              <div className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 pt-8 mt-8 border-t border-slate-100 dark:border-white/5">
                {t('auth.register.alreadyHaveAccount')}{" "}
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-blue-400 font-extrabold hover:text-blue-700 underline-offset-4 hover:underline transition-all"
                >
                  {t('auth.register.linkSignIn')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow"></div>

      {/* ===== OTP POPUP MODAL ===== */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {}} // Không cho phép đóng khi click ra ngoài (bắt buộc phải nhập OTP)
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#13151A] rounded-[2rem] p-8 shadow-2xl border border-slate-200/50 dark:border-white/10 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Icon Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white mb-2">
                {t('auth.register.otpModalTitle', { defaultValue: "Xác thực Email" })}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {t('auth.register.otpModalDesc', { defaultValue: "Chúng tôi đã gửi mã 6 chữ số đến" })}
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">{email}</p>
            </div>

            {/* OTP Input Fields */}
            <form onSubmit={handleVerifyOtp}>
              <div className="flex justify-center gap-3 mb-8">
                {otpInputs.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className={`w-12 h-14 text-center text-2xl font-extrabold rounded-2xl border-2 transition-all
                      bg-slate-50 dark:bg-white/5 text-blue-950 dark:text-white
                      focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20
                      ${digit ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-white/10'}
                    `}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isPendingVerify || emailOtp.length !== 6}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-bold text-base hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/10"
              >
                {isPendingVerify ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('auth.register.verifying', { defaultValue: "Đang xác thực..." })}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    {t('auth.register.btnVerify', { defaultValue: "Xác nhận OTP" })}
                  </>
                )}
              </button>
            </form>

            {/* Resend & Info */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t('auth.register.otpExpiry', { defaultValue: "Mã OTP có hiệu lực trong 10 phút" })}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpInputs(["", "", "", "", "", ""]);
                  setEmailOtp("");
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-medium transition-colors flex items-center gap-1 mx-auto"
              >
                <X className="w-3 h-3" />
                {t('auth.register.cancelVerify', { defaultValue: "Hủy và đăng ký lại" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InputFieldProps {
  icon: React.ReactElement;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{label}</label>
    <div className="relative group">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
        {React.cloneElement(icon, { className: "w-5 h-5" } as React.SVGProps<SVGSVGElement>)}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-base text-blue-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
      />
    </div>
  </div>
);
