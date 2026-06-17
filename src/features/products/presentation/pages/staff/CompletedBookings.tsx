import React, { useState } from 'react';
import { Search, CheckSquare, Calendar, Download } from 'lucide-react';
import { useStaffDashboard } from '../../../application/useStaffDashboard';

interface BookingResponseData {
    id: string;
    vehicleId: string;
    washPackageId: string;
    bookingDate: string;
    startTime: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'CheckedOut' | string;
    createdAt: string;
    totalPrice?: number;
}

export const CompletedBookings: React.FC = () => {
    // Ép kiểu chuẩn xác từ hook, không dùng as any
    const { bookings = [], isLoading } = useStaffDashboard() as {
        bookings: BookingResponseData[];
        isLoading: boolean;
    };

    const [searchTerm, setSearchTerm] = useState('');

    // Lọc theo Status (Completed/CheckedOut) VÀ tìm kiếm theo ID Xe hoặc ID Gói dịch vụ
    const completedBookings = bookings.filter(b => {
        const isMatchStatus = b.status === 'Completed' || b.status === 'CheckedOut';

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
            {/* Tiêu đề và nút xuất báo cáo */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Completed Bookings</h1>
                    <p className="text-gray-500 text-sm">Overview of all services successfully finished today.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Thẻ thống kê nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Completed</p>
                    <p className="text-2xl font-black text-emerald-600">{completedBookings.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                    <p className="text-2xl font-black text-gray-900">
                        {/* Map đúng trường totalPrice thay vì totalAmount */}
                        {completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toLocaleString('vi-VN')}đ
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Service Time</p>
                    <p className="text-2xl font-black text-gray-900">24 mins</p>
                </div>
            </div>

            {/* Ô tìm kiếm */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by vehicle ID or package ID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {completedBookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <CheckSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="font-semibold">No completed bookings yet</p>
                        <p className="text-sm">Finish some services to see them here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="py-4 px-6">Booking ID</th>
                                <th className="py-4 px-6">Vehicle / Package</th>
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Finished Time</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Payment</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {completedBookings.map(b => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Cắt ngắn ID để hiển thị đẹp hơn */}
                                    <td className="py-4 px-6 font-bold text-emerald-600 font-mono text-sm">
                                        {b.id.substring(0, 8)}...
                                    </td>

                                    {/* Thông tin Xe & Gói */}
                                    <td className="py-4 px-6">
                                        <p className="font-medium text-gray-900">{b.vehicleId || 'N/A'}</p>
                                        <p className="text-xs text-gray-500">{b.washPackageId}</p>
                                    </td>

                                    {/* Ngày thực hiện */}
                                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                                        {b.bookingDate}
                                    </td>

                                    {/* Giờ thực hiện */}
                                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-gray-400" />
                                            {b.startTime || '--:--'}
                                        </div>
                                    </td>

                                    {/* Trạng thái */}
                                    <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                b.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {b.status}
                                            </span>
                                    </td>

                                    {/* Tiền thanh toán */}
                                    <td className="py-4 px-6 text-right font-bold text-gray-900">
                                        {(b.totalPrice || 0).toLocaleString('vi-VN')}đ
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