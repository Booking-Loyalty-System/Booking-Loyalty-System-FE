import React, { useState } from 'react';
import {User, Phone, Lock, Droplets, CheckCircle2, Mail, Calendar} from 'lucide-react';
import {useAuth} from "@/features/products/application/useAuth.ts";

export const RegisterPage: React.FC = () => {
    // 1. Thêm các state mới để khớp với RegisterRequest
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register, isPending } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        // Gọi API ở đây!
        register({
            email,
            password,
            fullName,
            phoneNumber,
            dateOfBirth: new Date(dateOfBirth).toISOString(),
        });
    };

    return (
        <div className="h-screen w-screen bg-[#e6f0fa] flex items-center justify-center p-6 overflow-hidden antialiased font-sans">
            <div className="w-full px-20 py-6 bg-transparent flex flex-row gap-6 h-full">

                {/* PANEL TRÁI: GIỮ NGUYÊN HOÀN TOÀN */}
                <div className="flex-1 bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-white/40">
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
                <div className="flex-1 bg-white rounded-2xl pt-8 pb-10 px-10 flex flex-col justify-start shadow-sm border border-white/40 overflow-y-auto">
                    <div className="w-full max-w-[460px] mx-auto">
                        <div className="mb-5">
                            <h2 className="text-4xl font-bold text-[#0f172a] mb-1.5 tracking-tight">Create Account</h2>
                            <p className="text-[#64748b] text-base">Get started with AutoWash Pro</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Input Fields */}
                            <InputField icon={<User />} label="Full Name" value={fullName} onChange={setFullName} placeholder="John Doe" />
                            <InputField icon={<Mail />} label="Email" value={email} onChange={setEmail} placeholder="john@example.com" type="email" />
                            <InputField icon={<Phone />} label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} placeholder="+1 234 567 8900" />

                            <div className="flex gap-4">
                                <InputField icon={<Calendar />} label="DOB" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
                            </div>

                            <InputField icon={<Lock />} label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
                            <InputField icon={<Lock />} label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} type="password" placeholder="••••••••" />
                            <button
                                type="submit"
                                disabled={isPending} // Disable nút khi đang loading
                                className="w-full bg-[#4a90e2] text-white py-2.5 rounded-xl font-semibold hover:bg-[#357abd]"
                            >
                                {isPending ? "Đang xử lý..." : "Create Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
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