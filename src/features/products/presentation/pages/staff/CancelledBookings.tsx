import React, { useState } from 'react';
import { Search, XCircle, AlertCircle, User, ShieldAlert } from 'lucide-react';
import { useStaffDashboard } from '../../../application/useStaffDashboard';

export const CancelledBookings: React.FC = () => {
    const { bookings, isLoading } = useStaffDashboard();
    
    const [searchTerm, setSearchTerm] = useState('');

    // [KIẾN THỨC] Filter logic cho Cancelled/NoShow:
    // Kết hợp nhiều trạng thái vào một view duy nhất giúp nhân viên dễ quản lý các ca "không thành công".
    const cancelledBookings = bookings.filter(b => 
        (b.status === 'Cancelled' || b.status === 'NoShow') &&
        (b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (b.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false))
    );

    if (isLoading) return (
        <div className="p-8 space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Cancelled Bookings</h1>
                <p className="text-gray-500 text-sm">Xem lại các lịch đặt bị hủy hoặc khách hàng không đến.</p>
            </div>

            {/* Thẻ thống kê nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* [KIẾN THỨC] Conditional Statistics: Tính toán số lượng dựa trên điều kiện status ngay trong mảng đã lọc. */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tổng ca đã hủy</p>
                        <p className="text-2xl font-black text-rose-600">{cancelledBookings.filter(b => b.status === 'Cancelled').length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Số ca No-Show</p>
                        <p className="text-2xl font-black text-amber-600">{cancelledBookings.filter(b => b.status === 'NoShow').length}</p>
                    </div>
                </div>
            </div>

            {/* Ô tìm kiếm */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative">
                    {/* [KIẾN THỨC] UX/UI Tip: Màu sắc biểu tượng (Search) và màu Focus của Input đồng bộ với trạng thái chính của trang (Màu đỏ/Rose cho trang Hủy). */}
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm theo mã hoặc biển số..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {cancelledBookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="font-semibold">Không tìm thấy lịch đặt bị hủy nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="py-4 px-6">Mã Booking</th>
                                    <th className="py-4 px-6">Xe / Dịch vụ</th>
                                    <th className="py-4 px-6">Người thực hiện hủy</th>
                                    <th className="py-4 px-6">Lý do hủy</th>
                                    <th className="py-4 px-6">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {cancelledBookings.map(b => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-bold text-gray-900">{b.bookingCode || 'N/A'}</td>
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-gray-900">{b.licensePlate || 'Chưa cập nhật BSX'}</p>
                                            <p className="text-xs text-gray-500">{b.serviceName || 'Dịch vụ'}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            {/* [KIẾN THỨC] Conditional Rendering: Sử dụng toán tử tam phân (Ternary Operator) để hiển thị UI khác nhau tùy theo dữ liệu.
                                               Giúp người dùng nhận diện nhanh đối tượng thực hiện thao tác qua icon và màu sắc. */}
                                            {b.cancelledBy === 'Staff' ? (
                                                <div className="flex items-center gap-2 text-blue-600">
                                                    <ShieldAlert className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Nhân viên</span>
                                                </div>
                                            ) : b.cancelledBy === 'Customer' ? (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Khách hàng</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Chưa xác định</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            {/* [KIẾN THỨC] Fallback values (?? hoặc ||): Kỹ thuật "phòng vệ" tránh hiển thị rỗng hoặc undefined. */}
                                            <p className="text-gray-700 italic">
                                                {b.cancelReason ? `"${b.cancelReason}"` : 'Chưa cập nhật lý do hủy'}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                b.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {b.status === 'NoShow' ? 'No Show' : b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
