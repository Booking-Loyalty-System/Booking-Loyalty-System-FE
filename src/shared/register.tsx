import React from 'react';
import { User, Phone, Car, Lock, Droplets, CheckCircle2 } from 'lucide-react';

// Định nghĩa các props để RegisterPage ở ngoài có thể truyền dữ liệu và sự kiện vào
interface RegisterProps {
    fullName: string;
    setFullName: (value: string) => void;
    phoneNumber: string;
    setPhoneNumber: (value: string) => void;
    vehiclePlate: string;
    setVehiclePlate: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    agreeTerms: boolean;
    setAgreeTerms: (value: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading?: boolean;
    error?: string | null;
}

export const RegisterShared: React.FC<RegisterProps> = ({
                                                            fullName,
                                                            setFullName,
                                                            phoneNumber,
                                                            setPhoneNumber,
                                                            vehiclePlate,
                                                            setVehiclePlate,
                                                            password,
                                                            setPassword,
                                                            confirmPassword,
                                                            setConfirmPassword,
                                                            agreeTerms,
                                                            setAgreeTerms,
                                                            onSubmit,
                                                            isLoading = false,
                                                            error = null
                                                        }) => {
    return (
        <div className="min-h-screen bg-[#e6f0fa] flex items-center justify-center p-4 antialiased font-sans">
            {/* Container chính với viền màu xanh giống hình Figma */}
            <div className="w-full max-w-[1100px] border-3 border-[#1e6ffd] rounded-lg bg-transparent flex flex-col md:flex-row gap-6 items-stretch">

                {/* PANEL TRÁI: Giới thiệu cộng đồng & Quyền lợi */}
                <div className="flex-1 bg-white rounded-2xl p-8 flex flex-col shadow-sm justify-center">
                    <div className="max-w-[440px] mx-auto w-full">
                        {/* Header / Logo */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#1e6ffd] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                                <Droplets className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#0f172a]">AutoWash Pro</h1>
                                <p className="text-sm text-[#64748b]">Join our community</p>
                            </div>
                        </div>

                        {/* Ảnh xe ô tô xịt bọt tuyết */}
                        <div className="w-full overflow-hidden rounded-2xl mb-6 aspect-[16/11]">
                            <img
                                src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=1000"
                                alt="Car Wash Foam"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Hộp Membership Benefits màu xanh nhạt */}
                        <div className="bg-[#f0f6fe] rounded-2xl p-6">
                            <h3 className="font-bold text-[#0f172a] text-base mb-4">Membership Benefits</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-[#334155]">
                                    <CheckCircle2 className="w-5 h-5 text-[#1e6ffd] fill-current text-white" />
                                    <span>Earn loyalty points on every wash</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[#334155]">
                                    <CheckCircle2 className="w-5 h-5 text-[#1e6ffd] fill-current text-white" />
                                    <span>Priority booking for VIP members</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[#334155]">
                                    <CheckCircle2 className="w-5 h-5 text-[#1e6ffd] fill-current text-white" />
                                    <span>Exclusive discounts and promotions</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-[#334155]">
                                    <CheckCircle2 className="w-5 h-5 text-[#1e6ffd] fill-current text-white" />
                                    <span>Track your booking history</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* PANEL PHẢI: Form Đăng ký tài khoản */}
                <div className="flex-1 bg-white rounded-2xl p-8 md:p-10 flex flex-col justify-center shadow-sm">
                    <div className="w-full max-w-[440px] mx-auto">

                        {/* Tiêu đề form */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-[#0f172a] mb-1">Create Account</h2>
                            <p className="text-[#64748b] text-[15px]">Get started with AutoWash Pro</p>
                        </div>

                        {/* Form Fields */}
                        <form onSubmit={onSubmit} className="space-y-4">

                            {/* Full Name Input */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#475569]">Full Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94a3b8]">
                                        <User className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e6ffd] focus:ring-1 focus:ring-[#1e6ffd] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Phone Number Input */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#475569]">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94a3b8]">
                                        <Phone className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+1 234 567 8900"
                                        required
                                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e6ffd] focus:ring-1 focus:ring-[#1e6ffd] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Vehicle Plate Number Input */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#475569]">Vehicle Plate Number</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94a3b8]">
                                        <Car className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="text"
                                        value={vehiclePlate}
                                        onChange={(e) => setVehiclePlate(e.target.value)}
                                        placeholder="ABC-1234"
                                        required
                                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e6ffd] focus:ring-1 focus:ring-[#1e6ffd] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#475569]">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94a3b8]">
                                        <Lock className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e6ffd] focus:ring-1 focus:ring-[#1e6ffd] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#475569]">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94a3b8]">
                                        <Lock className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e6ffd] focus:ring-1 focus:ring-[#1e6ffd] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Terms of Service Checkbox */}
                            <div className="flex items-start gap-2 pt-1 select-none">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    required
                                    className="w-4 h-4 mt-0.5 rounded border-[#cbd5e1] text-[#1e6ffd] focus:ring-[#1e6ffd]"
                                />
                                <label htmlFor="terms" className="text-sm text-[#475569] leading-tight cursor-pointer">
                                    I agree to the <a href="#" className="text-[#1e6ffd] hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-[#1e6ffd] hover:underline font-medium">Privacy Policy</a>
                                </label>
                            </div>

                            {/* Hiển thị lỗi từ hệ thống nếu có */}
                            {error && (
                                <div className="text-sm text-red-500 bg-red-50 border border-red-100 p-3 rounded-xl font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Button Submit với hiệu ứng Loading Spinner */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#1e6ffd] disabled:bg-[#7ea2f7] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[#1a5fdb] active:scale-[0.99] transition-all shadow-sm mt-3 flex items-center justify-center h-[48px]"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            {/* Điều hướng về đăng nhập */}
                            <div className="text-center text-sm text-[#475569] pt-2">
                                Already have an account?{' '}
                                <a href="#" className="text-[#1e6ffd] hover:underline font-semibold">
                                    Sign In
                                </a>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
};