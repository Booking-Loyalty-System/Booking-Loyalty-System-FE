import React, { useState } from 'react';
import { Search, CheckSquare, Calendar, Download } from 'lucide-react';
import { useStaffDashboard } from '../../../application/useStaffDashboard';

export const CompletedBookings: React.FC = () => {
    const { bookings, isLoading } = useStaffDashboard();
    const [searchTerm, setSearchTerm] = useState('');

    const completedBookings = bookings.filter(b => 
        (b.status === 'Completed' || b.status === 'CheckedOut') &&
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Completed Bookings</h1>
                    <p className="text-gray-500 text-sm">List of all successfully finished services today.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Completed</p>
                    <p className="text-2xl font-black text-emerald-600">{completedBookings.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                    <p className="text-2xl font-black text-gray-900">
                        {completedBookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString('vi-VN')}đ
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Average Service Time</p>
                    <p className="text-2xl font-black text-gray-900">24 mins</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by code or license plate..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
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
                                    <th className="py-4 px-6">Booking Code</th>
                                    <th className="py-4 px-6">Customer / Vehicle</th>
                                    <th className="py-4 px-6">Service</th>
                                    <th className="py-4 px-6">Completed Time</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {completedBookings.map(b => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-bold text-emerald-600">{b.bookingCode || 'N/A'}</td>
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-gray-900">{b.licensePlate || 'Chưa cập nhật BSX'}</p>
                                            <p className="text-xs text-gray-500">{b.vehicleName || 'Thông tin xe'}</p>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{b.serviceName || 'Dịch vụ'}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                {b.startTime || '--:--'} 
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                b.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold text-gray-900">
                                            {b.totalAmount.toLocaleString('vi-VN')}đ
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
