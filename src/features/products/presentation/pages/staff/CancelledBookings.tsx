import React, { useState } from 'react';
import { Search, XCircle, AlertCircle } from 'lucide-react';
import { useStaffDashboard } from '../../../application/useStaffDashboard';

interface BookingResponseData {
    id: string;
    vehicleId: string;
    washPackageId: string;
    bookingDate: string;
    startTime: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'NoShow' | 'Rejected' | string;
    createdAt: string;
}

export const CancelledBookings: React.FC = () => {
    // Không dùng "as" ép kiểu lệch nữa, lấy đúng dữ liệu từ hook ra
    const { bookings = [], isLoading } = useStaffDashboard() as {
        bookings: BookingResponseData[];
        isLoading: boolean;
    };

    const [searchTerm, setSearchTerm] = useState('');

    // ĐÃ XÓA: State `selectedBookingForReason` bị thừa, gây lỗi ESLint unused-vars.

    // Bộ lọc dữ liệu theo thuộc tính của BookingResponseData
    const cancelledBookings = bookings.filter(b => {
        const isMatchStatus = b.status === 'Cancelled' || b.status === 'NoShow' || b.status === 'Rejected';

        // Tìm kiếm theo ID của xe hoặc ID của gói dịch vụ
        const vehicle = b.vehicleId?.toLowerCase() || '';
        const packId = b.washPackageId?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return isMatchStatus && (vehicle.includes(search) || packId.includes(search));
    });

    if (isLoading) return (
        <div className="p-8 space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
    );

    return (
        <div className="space-y-6 font-sans antialiased">
            {/* Tiêu đề trang */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Cancelled Bookings</h1>
                <p className="text-gray-500 text-sm">Review bookings that were cancelled or marked as no-show.</p>
            </div>

            {/* Thẻ thống kê nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Cancelled</p>
                        <p className="text-2xl font-black text-rose-600">
                            {cancelledBookings.filter(b => b.status === 'Cancelled' || b.status === 'Rejected').length}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total No-Show</p>
                        <p className="text-2xl font-black text-amber-600">
                            {cancelledBookings.filter(b => b.status === 'NoShow').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Ô tìm kiếm */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by vehicle ID or package ID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Bảng dữ liệu chuẩn hóa */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {cancelledBookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="font-semibold">No cancelled bookings found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="py-4 px-6">Booking ID</th>
                                <th className="py-4 px-6">Vehicle / Package ID</th>
                                <th className="py-4 px-6">Date & Time</th>
                                <th className="py-4 px-6">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                            {cancelledBookings.map(b => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    {/* ID Đơn (Sửa lại cho đúng trường của BookingResponseData) */}
                                    <td className="py-4 px-6 font-mono font-bold text-blue-600">{b.id.substring(0, 8)}...</td>

                                    {/* Thông tin Xe & Gói dịch vụ */}
                                    <td className="py-4 px-6">
                                        <p className="font-semibold text-gray-900">{b.vehicleId || 'N/A'}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{b.washPackageId}</p>
                                    </td>

                                    {/* Ngày & Giờ thay vì TotalPrice vì API chưa trả về giá */}
                                    <td className="py-4 px-6 font-medium text-gray-700">
                                        <p>{b.bookingDate}</p>
                                        <p className="text-xs text-gray-400">{b.startTime}</p>
                                    </td>

                                    {/* Trạng thái Label */}
                                    <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                b.status === 'Cancelled' || b.status === 'Rejected'
                                                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
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