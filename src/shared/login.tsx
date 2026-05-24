import { Mail, Lock, Droplets } from 'lucide-react';

export default function Login() {
    return (
        <div className="min-h-screen bg-[#e6f0fa] flex items-center justify-center p-4 antialiased font-sans">
            {/* Container chính với viền nét đứt màu xanh như trong hình */}
            <div className="w-full max-w-[1100px] border-2 border-dashed border-[#1e6ffd] rounded-lg p-6 bg-transparent flex flex-col md:flex-row gap-6">

                {/* PANEL TRÁI: Giới thiệu tính năng */}
                <div className="flex-1 bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm">
                    <div>
                        {/* Header / Logo */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#1e6ffd] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                                <Droplets className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#0f172a]">AutoWash Pro</h1>
                                <p className="text-sm text-[#64748b]">Smart Car Wash Management</p>
                            </div>
                        </div>

                        {/* Ảnh xe ô tô */}
                        <div className="w-full overflow-hidden rounded-2xl mb-8 aspect-[16/10]">
                            <img
                                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1000"
                                alt="Premium BMW Car"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Danh sách tính năng */}
                        <div className="space-y-5">
                            {/* Tính năng 1 */}
                            <div className="flex items-start gap-4">
                                <div className="w-7 h-7 rounded-md bg-[#e6f0fa] text-[#1e6ffd] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#0f172a] text-base">Easy Booking</h3>
                                    <p className="text-sm text-[#64748b]">Schedule your car wash in seconds</p>
                                </div>
                            </div>

                            {/* Tính năng 2 */}
                            <div className="flex items-start gap-4">
                                <div className="w-7 h-7 rounded-md bg-[#e6f0fa] text-[#1e6ffd] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#0f172a] text-base">Loyalty Rewards</h3>
                                    <p className="text-sm text-[#64748b]">Earn points and get exclusive benefits</p>
                                </div>
                            </div>

                            {/* Tính năng 3 */}
                            <div className="flex items-start gap-4">
                                <div className="w-7 h-7 rounded-md bg-[#e6f0fa] text-[#1e6ffd] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#0f172a] text-base">Premium Service</h3>
                                    <p className="text-sm text-[#64748b]">Professional car care guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PANEL PHẢI: Form đăng nhập */}
                <div className="flex-1 bg-white rounded-2xl p-10 flex flex-col justify-center shadow-sm">
                    <div className="w-full max-w-[420px] mx-auto">

                        {/* Tiêu đề form */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Welcome Back</h2>
                            <p className="text-[#64748b] text-[15px]">Sign in to your account to continue</p>
                        </div>

                        {/* Form Fields */}
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#334155]">Email Address</label>
                                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94a3b8]">
                    <Mail className="w-5 h-5" />
                  </span>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e6ffd] focus:ring-1 focus:ring-[#1e6ffd] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#334155]">Password</label>
                                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94a3b8]">
                    <Lock className="w-5 h-5" />
                  </span>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#1e6ffd] focus:ring-1 focus:ring-[#1e6ffd] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between text-sm pt-1">
                                <label className="flex items-center gap-2 text-[#475569] cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[#cbd5e1] text-[#1e6ffd] focus:ring-[#1e6ffd]"
                                    />
                                    Remember me
                                </label>
                                <a href="#" className="text-[#1e6ffd] hover:underline font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Button Sign In */}
                            <button
                                type="submit"
                                className="w-full bg-[#1e6ffd] text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-[#1a5fdb] active:scale-[0.99] transition-all shadow-sm mt-2"
                            >
                                Sign In
                            </button>

                            {/* Create Account Link */}
                            <div className="text-center text-sm text-[#475569] pt-2">
                                Don't have an account?{' '}
                                <a href="#" className="text-[#1e6ffd] hover:underline font-semibold">
                                    Create Account
                                </a>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="border-t border-[#f1f5f9] my-8"></div>

                        {/* Quick Access (Demo) */}
                        <div className="text-center">
              <span className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider block mb-3">
                Quick Access (Demo)
              </span>
                            <div className="grid grid-cols-3 gap-2">
                                <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-medium text-xs py-2 px-3 rounded-lg transition-colors">
                                    Customer
                                </button>
                                <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-medium text-xs py-2 px-3 rounded-lg transition-colors">
                                    Staff
                                </button>
                                <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#475569] font-medium text-xs py-2 px-3 rounded-lg transition-colors">
                                    Admin
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}