import React, { useState } from 'react';
import { Mail, Lock, Droplets } from 'lucide-react';
import { useAuth } from '../../application/useAuth.ts';
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google'; // 🌟 Chuyển sang dùng hook useGoogleLogin để lấy code
import { CarScene } from "@/shared/car-scene.tsx";
import { toast } from "sonner";

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isDemo, setIsDemo] = useState(false);
    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const authData = await login({ email, password });

            if (isDemo) {
                toast.info(`Demo: Đăng nhập thành công với vai trò ${authData.user.role}`);
            } else {
                toast.success('Đăng nhập thành công!');
            }

            setTimeout(() => {
                setIsDemo(false);
                switch (authData.user.role) {
                    case 'Customer':
                        navigate('/dashboard');
                        break;

                    case 'Staff':
                        navigate('/staff/dashboard');
                        break;

                    case 'Admin':
                        navigate('/admin/dashboard');
                        break;

                    default:
                        navigate('/login');
                }
            }, 1000);
        } catch (err) {
            console.error("Đăng nhập email thất bại:", err);
            setIsDemo(false);
        }
    };

    // 🌟 Hàm xử lý khi lấy thành công 'code' từ phía Google
    const handleGoogleSuccess = async (tokenResponse: { code: string }) => {
        const authCode = tokenResponse.code;
        console.log("Google Authorization Code thành công:", authCode);

        try {
            // 🔥 Truyền code trực tiếp vào URL parameters gửi lên API .NET Core
            const response = await fetch(`https://localhost:7001/api/auth/googleLogin?code=${encodeURIComponent(authCode)}`, {
                method: 'POST', // Giữ POST hoặc đổi sang GET tùy theo cấu hình Endpoint [HttpPost] hay [HttpGet] ở Backend
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.token); // Lưu token hệ thống cấp phát
                alert('Đăng nhập bằng Google thành công!');
                navigate('/auto-wash-simulation');
                // window.location.href = '/dashboard';
            } else {
                alert('Backend xác thực Google code thất bại.');
            }
        } catch (err) {
            console.error('Lỗi kết nối API Backend:', err);
        }
    };

    // 🌟 Khởi tạo trigger Login thông qua Hook
    const triggerGoogleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => console.log('Google Đăng nhập thất bại'),
        flow: 'auth-code', // 🔥 Bắt buộc cấu hình flow này để nhận chuỗi 'code' thay vì idToken
    });

    const handleQuickAccess = (role: 'customer' | 'staff' | 'admin') => {
        const credentials = {
            customer: { email: 'customer@system.com', pass: 'customer' },
            staff: { email: 'staff@system.com', pass: 'staff' },
            admin: { email: 'admin@system.com', pass: 'admin' }
        };

        setIsDemo(true);
        setEmail(credentials[role].email);
        setPassword(credentials[role].pass);
    };

    return (
        <div className="h-screen w-screen bg-[#e6f
        0fa] flex items-center justify-center p-6 overflow-hidden antialiased font-sans">
            <div className="w-full px-20 py-6 bg-transparent flex flex-row gap-6 h-full">

                {/* PANEL TRÁI: GIỚI THIỆU TÍNH NĂNG */}
                <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-white/40">
                    <div>
                        {/* LOGO & BRANDING */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-14 h-14 bg-[#4a90e2] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                                <Droplets className="w-8 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-[#0f172a] leading-tight tracking-tight">AutoWash Pro</h1>
                                <p className="text-base text-[#64748b] font-medium mt-0.5">Smart Car Wash Management</p>
                            </div>
                        </div>

                        {/* BANNER 3D SCENE */}
                        <div className="w-full overflow-hidden rounded-xl mb-6 aspect-[16/9] max-h-[300px]">
                            <CarScene />
                        </div>

                        {/* DANH SÁCH TÍNH NĂNG NỔI BẬT */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-[#e6f0fa] text-[#1e6ffd] font-bold text-2xl flex items-center justify-center shrink-0 mt-0.5">1</div>
                                <div>
                                    <h3 className="font-bold text-[#0f172a] text-lg">Easy Booking</h3>
                                    <p className="text-base text-[#64748b] mt-0.5">Schedule your car wash in seconds</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-[#e6f0fa] text-[#1e6ffd] font-bold text-2xl flex items-center justify-center shrink-0 mt-0.5">2</div>
                                <div>
                                    <h3 className="font-bold text-[#0f172a] text-lg">Loyalty Rewards</h3>
                                    <p className="text-base text-[#64748b] mt-0.5">Earn points and get exclusive benefits</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-[#e6f0fa] text-[#1e6ffd] font-bold text-2xl flex items-center justify-center shrink-0 mt-0.5">3</div>
                                <div>
                                    <h3 className="font-bold text-[#0f172a] text-lg">Premium Service</h3>
                                    <p className="text-base text-[#64748b] mt-0.5">Professional car care guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PANEL PHẢI: FORM ĐĂNG NHẬP */}
                <div className="flex-1 bg-white rounded-2xl p-8 flex flex-col justify-start shadow-sm border border-white/40">
                    <div className="w-full max-w-[460px] mx-auto">

                        {/* TIÊU ĐỀ FORM */}
                        <div className="mb-6">
                            <h2 className="text-4xl font-bold text-[#0f172a] mb-1.5 tracking-tight">Welcome Back</h2>
                            <p className="text-[#64748b] text-base">Sign in to your account to continue</p>
                        </div>

                        {/* KHU VỰC FORM */}
                        <form onSubmit={handleSubmit} className="space-y-4.5">

                            {/* EMAIL */}
                            <div className="space-y-1.5">
                                <label className="text-lg font-semibold text-[#334155]">Email Address</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94a3b8]">
                                        <Mail className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-base text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] transition-all"
                                    />
                                </div>
                            </div>

                            {/* MẬT KHẨU */}
                            <div className="space-y-1.5">
                                <label className="text-lg font-semibold text-[#334155]">Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94a3b8]">
                                        <Lock className="w-5 h-5" />
                                    </span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-base text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] transition-all"
                                    />
                                </div>
                            </div>

                            {/* GHI NHỚ & QUÊN MẬT KHẨU */}
                            <div className="flex items-center justify-between text-base pt-1">
                                <label className="flex items-center gap-2 text-[#475569] cursor-pointer select-none font-medium">
                                    <input type="checkbox" className="w-5 h-5 rounded border-[#cbd5e1] text-[#4a90e2] focus:ring-[#4a90e2]" />
                                    Remember me
                                </label>
                                <a href="#" className="text-[#4a90e2] hover:underline font-semibold">Forgot password?</a>
                            </div>

                            {/* LỖI ĐĂNG NHẬP */}
                            {error && (
                                <div className="text-xs text-red-500 bg-red-50 border border-red-100 p-2.5 rounded-lg font-medium">
                                    Đăng nhập thất bại. Vui lòng thử lại!
                                </div>
                            )}

                            {/* NÚT SIGN IN THƯỜNG */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#4a90e2] disabled:bg-[#a3c7f5] text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-[#357abd] active:scale-[0.99] transition-all text-base shadow-sm mt-2 flex items-center justify-center"
                            >
                                {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
                            </button>

                            {/* 🌟 NÚT GOOGLE CUSTOM MỚI (Đồng bộ thiết kế UI với form và gọi trigger hook) */}
                            <button
                                type="button"
                                onClick={() => triggerGoogleLogin()}
                                className="w-full bg-white border border-[#e2e8f0] text-[#334155] font-semibold py-2.5 px-4 rounded-xl hover:bg-[#f8fafc] active:scale-[0.99] transition-all text-base shadow-sm flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#EA4335" d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13.2s5.48 12.2 12.24 12.2c7.055 0 11.75-4.943 11.75-11.914 0-.806-.088-1.423-.192-2.2H12.24z" />
                                </svg>
                                Sign in with Google
                            </button>

                            {/* CHUYỂN TRANG ĐĂNG KÝ */}
                            <div className="text-center text-base text-[#475569] pt-1">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-[#4a90e2] hover:underline font-semibold">Create Account</Link>
                            </div>
                        </form>

                        <div className="border-t border-[#f1f5f9] my-4"></div>

                        {/* QUICK ACCESS (DEMO) */}
                        <div className="text-center">
                            <span className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider block mb-2">Quick Access (Demo)</span>
                            <div className="grid grid-cols-3 gap-2">
                                <button type="button" onClick={() => handleQuickAccess('customer')} className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors">Customer</button>
                                <button type="button" onClick={() => handleQuickAccess('staff')} className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors">Staff</button>
                                <button type="button" onClick={() => handleQuickAccess('admin')} className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-semibold text-xs py-1.5 px-3 rounded-lg transition-colors">Admin</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};