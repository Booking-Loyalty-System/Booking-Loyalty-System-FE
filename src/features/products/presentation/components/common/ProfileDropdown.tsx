import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, Settings, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/features/products/application/useAuth';

import { useCustomerMe } from '@/features/products/application/useCustomer.ts';

export const ProfileDropdown: React.FC = () => {
    const navigate = useNavigate();

    // 💡 LẤY THÔNG TIN USER VÀ TRẠNG THÁI LOGOUT TỪ HOOK
    const { user, logout, isLoggingOut } = useAuth();
    const { customerMe } = useCustomerMe();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Tính toán các thông tin hiển thị dựa trên state của useAuth
    const fullName = customerMe?.fullName || user?.fullName || "Khách hàng";
    const avatarFallback = fullName.split(" ").pop()?.substring(0, 2).toUpperCase() || "KH";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 💡 XỬ LÝ ASYNC LOGOUT
    const handleLogoutClick = async () => {
        try {
            setIsDropdownOpen(false); // Đóng dropdown trước cho trải nghiệm mượt mà
            await logout();           // Đợi API logout chạy xong (clear cache và localStorage)
            navigate('/');       // Chuyển hướng về trang chủ
        } catch (error) {
            console.error("Logout failed:", error);
            // Kể cả lỗi thì useAuth của bạn vẫn clear client session,
            // nên bạn vẫn có thể cho navigate về / ở đây nếu muốn chắc chắn.
            navigate('/');
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoggingOut} // Disable nút khi đang trong quá trình gọi API logout
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#f1f5f9] transition-all focus:outline-none group disabled:opacity-70"
            >
                <div className="text-right hidden sm:block select-none">
                    <h4 className="text-sm font-bold text-[#0f172a] group-hover:text-[#1e6ffd] transition-colors">{fullName}</h4>
                    <p className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider text-left">Customer</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1e6ffd] to-[#6366f1] text-white font-bold text-sm flex items-center justify-center shadow-sm relative group-hover:scale-105 transition-transform">
                    {avatarFallback}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>

                <ChevronDown className={`w-4 h-4 text-[#64748b] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="px-4 py-2.5 border-b border-[#f1f5f9]">
                        <p className="text-xs text-[#94a3b8] font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-[#0f172a] truncate">{user?.email || "customer@autowash.com"}</p>
                    </div>

                    <div className="p-1">
                        <Link
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-all"
                        >
                            <User className="w-4 h-4 text-[#1e6ffd]" />
                            My Profile
                        </Link>
                        <Link
                            to="/settings"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-all"
                        >
                            <Settings className="w-4 h-4 text-[#64748b]" />
                            Account Settings
                        </Link>
                    </div>

                    <div className="p-1 border-t border-[#f1f5f9] mt-1">
                        <button
                            onClick={handleLogoutClick}
                            disabled={isLoggingOut}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left disabled:opacity-50"
                        >
                            {isLoggingOut ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-4 h-4" />
                                    Log Out
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};