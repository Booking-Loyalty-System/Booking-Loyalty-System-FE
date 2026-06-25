import React, {useRef, useState} from 'react';
import { toast } from "sonner";
import {User, Phone, Lock, Droplets, CheckCircle2, Mail, Calendar, KeyRound} from 'lucide-react';
import {useAuth} from "@/features/products/application/useAuth.ts";
import { auth } from "@/firebase-config.ts";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { Link } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
    // 1. Thêm các state mới để khớp với RegisterRequest
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [vehicleType, setVehicleType] = useState<number>(0);
    const [licensePlate, setLicensePlate] = useState('');
    const { register, registerWithPhone, isPending, isPendingPhone } = useAuth();
    const [registerMode, setRegisterMode] = useState<'email' | 'phone'>('email');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);

    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
    const recaptchaContainerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }
        try {
            register({
                email,
                password,
                fullName,
                phoneNumber,
                dateOfBirth: new Date(dateOfBirth).toISOString(),
                vehicleType,
                licensePlate,
            });
            toast.success("Đăng ký tài khoản thành công!");
        } catch (error) {
            console.error("Đăng nhập email thất bại:", error);
        }
    };

    const setupRecaptcha = () => {
        if (!recaptchaVerifierRef.current && recaptchaContainerRef.current && auth) {
            recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                'size': 'visible',
            });
        }
    };

    const handleSendOTP = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!phoneNumber) return toast.warning("Vui lòng nhập số điện thoại");

        try {
            setupRecaptcha();
            const appVerifier = recaptchaVerifierRef.current;

            if (!appVerifier) {
                toast.error("Không thể khởi tạo bộ xác thực reCaptcha.");
                return;
            }

            const formattedPhone = phoneNumber.startsWith('0') ? '+84' + phoneNumber.slice(1) : phoneNumber;

            const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmResult(result);
            setIsOtpSent(true);
            toast.success("Đã gửi mã OTP thành công!");
        } catch (error) {
            const err = error as Error;
            console.error("Lỗi gửi OTP:", err);
            toast.error("Không thể gửi OTP: " + err.message);
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
            // 3. Gọi API registerWithPhone của hệ thống
            registerWithPhone({
                phoneNumber: verifiedPhone,
                idToken: idToken
            });
            toast.success("Xác thực OTP thành công! Đang đăng nhập...");
        } catch (error) {
            console.error("Sai OTP:", error);
            toast.error("Mã OTP không chính xác hoặc đã hết hạn!");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#e6f0fa] flex flex-col p-4 md:p-6 antialiased font-sans overflow-y-auto">
            <div className="flex-grow"></div>
            <div className="w-full max-w-6xl mx-auto bg-transparent flex flex-col lg:flex-row gap-5 h-auto">

                {/* PANEL TRÁI: GIỮ NGUYÊN HOÀN TOÀN */}
                <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-center shadow-sm border border-white/40">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-14 h-14 bg-[#4a90e2] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                                <Droplets className="w-8 h-7" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-[#0f172a] leading-tight tracking-tight">AutoWash Pro</h1>
                                <p className="text-base text-[#64748b] font-medium mt-0.5">Join our community</p>
                            </div>
                        </div>
                        <div className="w-full overflow-hidden rounded-xl mb-6 aspect-[16/9] max-h-[300px]">
                            <img src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000" alt="Car Wash Foam" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-[#f0f6fe] rounded-2xl pt-4 pb-6 px-6">
                            <h3 className="font-bold text-[#0f172a] text-xl mb-4 ">Membership Benefits</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-base text-[#334155]"><CheckCircle2 className="w-6 h-6 text-[#4a90e2] fill-current text-white" /><span>Earn loyalty points on every wash</span></li>
                                <li className="flex items-center gap-3 text-base text-[#334155]"><CheckCircle2 className="w-6 h-6 text-[#4a90e2] fill-current text-white" /><span>Priority booking for VIP members</span></li>
                                <li className="flex items-center gap-3 text-base text-[#334155]"><CheckCircle2 className="w-6 h-6 text-[#4a90e2] fill-current text-white" /><span>Exclusive discounts and promotions</span></li>
                                <li className="flex items-center gap-3 text-base text-[#334155]"><CheckCircle2 className="w-6 h-6 text-[#4a90e2] fill-current text-white" /><span>Track your booking history</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* PANEL PHẢI: GIỮ NGUYÊN CẤU TRÚC, CHỈ THÊM INPUT */}
                <div className="flex-1 bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-start shadow-sm border border-white/40 overflow-y-auto">
                    <div className="w-full max-w-md mx-auto">
                        <div className="mb-5">
                            <h2 className="text-4xl font-bold text-[#0f172a] mb-1.5 tracking-tight">Create Account</h2>
                            <p className="text-[#64748b] text-base">Get started with AutoWash Pro</p>
                        </div>

                        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                            <button
                                onClick={() => setRegisterMode('email')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${registerMode === 'email' ? 'bg-white shadow text-[#4a90e2]' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Bằng Email
                            </button>
                            <button
                                onClick={() => setRegisterMode('phone')}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${registerMode === 'phone' ? 'bg-white shadow text-[#4a90e2]' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Bằng SĐT (OTP)
                            </button>
                        </div>

                        {registerMode === 'email' && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Input Fields */}
                            <InputField icon={<User />} label="Full Name" value={fullName} onChange={setFullName} placeholder="John Doe" />
                            <InputField icon={<Mail />} label="Email" value={email} onChange={setEmail} placeholder="john@example.com" type="email" />
                            <InputField icon={<Phone />} label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} placeholder="0912345678" />

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <InputField icon={<Calendar />} label="DOB" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
                                </div>
                                <div className="space-y-1.5 flex-1">
                                    <label className="text-sm font-semibold text-[#334155]">Vehicle Type</label>
                                    <select
                                        value={vehicleType}
                                        onChange={(e) => setVehicleType(Number(e.target.value))}
                                        className="w-full px-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-base focus:border-[#4a90e2] outline-none transition-all h-[46px]"
                                    >
                                        <option value={0}>Small</option>
                                        <option value={1}>Medium</option>
                                        <option value={2}>Large</option>
                                    </select>
                                </div>
                            </div>
                            <InputField icon={<User />} label="License Plate (Optional)" value={licensePlate} onChange={setLicensePlate} placeholder="e.g. 29A-12345" />

                            <InputField icon={<Lock />} label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
                            <InputField icon={<Lock />} label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} type="password" placeholder="••••••••" />
                            <button
                                type="submit"
                                disabled={isPending} // Disable nút khi đang loading
                                className="w-full bg-[#4a90e2] text-white py-2.5 rounded-xl font-semibold hover:bg-[#357abd]"
                            >
                                {isPending ? "Đang xử lý..." : "Create Account"}
                            </button>
                            <div className="text-center text-sm text-[#475569] pt-2">
                                Already have an account?{" "}
                                <Link to="/login" className="text-[#4a90e2] hover:underline font-semibold">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                            )}

                        {registerMode === 'phone' && (
                            <form onSubmit={handlePhoneSubmit} className="space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-[#334155]">Phone Number</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94a3b8]">
                                                <Phone size={18} />
                                            </span>
                                            <input
                                                type="text"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="+84 901 234 567"
                                                disabled={isOtpSent} // Khóa ô nhập khi đã gửi OTP
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-base focus:border-[#4a90e2] outline-none transition-all disabled:bg-slate-50"
                                            />
                                        </div>
                                        {!isOtpSent && (
                                            <button
                                                onClick={handleSendOTP}
                                                className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-800 whitespace-nowrap"
                                            >
                                                Gửi mã
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div ref={recaptchaContainerRef}></div>

                                {isOtpSent && (
                                    <>
                                        <InputField
                                            icon={<KeyRound />}
                                            label="Mã OTP"
                                            value={otp}
                                            onChange={setOtp}
                                            placeholder="Nhập 6 số OTP..."
                                            type="text"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isPendingPhone}
                                            className="w-full bg-emerald-500 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-600 mt-4 transition-colors"
                                        >
                                            {isPendingPhone ? "Đang xác thực..." : "Xác nhận & Đăng ký"}
                                        </button>
                                    </>
                                )}
                                <div className="text-center text-sm text-[#475569] pt-2">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-[#4a90e2] hover:underline font-semibold">
                                        Sign In
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-grow"></div>
        </div>
    );
};

interface InputFieldProps {
    icon: React.ReactElement; // Dùng ReactElement thay vì any
    label: string;
    value: string;
    onChange: (value: string) => void; // Định nghĩa kiểu hàm callback
    placeholder?: string; // Dấu ? nghĩa là không bắt buộc
    type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                   icon,
                                                   label,
                                                   value,
                                                   onChange,
                                                   placeholder,
                                                   type = "text"
                                               }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-[#334155]">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94a3b8]">
                {/* Dùng một interface tường minh để TypeScript không báo lỗi thuộc tính size */}
                {React.cloneElement(icon, { size: 18 } as React.SVGProps<SVGSVGElement>)}
            </span>
            <input
                type={type}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                placeholder={placeholder}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-base focus:border-[#4a90e2] outline-none transition-all"
            />
        </div>
    </div>
);