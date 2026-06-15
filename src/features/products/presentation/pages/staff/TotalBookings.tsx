import React, { useState } from 'react';
import { Calendar, Search, Filter, ClipboardList } from 'lucide-react';
import { useStaffDashboard } from '../../../application/useStaffDashboard';

export const TotalBookings: React.FC = () => {
    const { bookings, isLoading } = useStaffDashboard();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (b.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
                    <h1 className="text-2xl font-bold text-gray-900">Total Bookings</h1>
                    <p className="text-gray-500 text-sm">Overview of all bookings scheduled for today.</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-semibold text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString('vi-VN')}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by code or license plate..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select 
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="CheckedIn">Checked In</option>
                        <option value="Queued">Queued</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="CheckedOut">Checked Out</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="NoShow">No Show</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {filteredBookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ClipboardList className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="font-semibold">No bookings found</p>
                        <p className="text-sm">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="py-4 px-6">Booking Code</th>
                                    <th className="py-4 px-6">Customer / Vehicle</th>
                                    <th className="py-4 px-6">Service</th>
                                    <th className="py-4 px-6">Time</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredBookings.map(b => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-bold text-blue-600">{b.bookingCode || 'N/A'}</td>
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-gray-900">{b.licensePlate || 'Chưa cập nhật BSX'}</p>
                                            <p className="text-xs text-gray-500">{b.vehicleName || 'Thông tin xe đang cập nhật'}</p>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-700">{b.serviceName || 'Dịch vụ đã chọn'}</td>
                                        <td className="py-4 px-6 text-sm text-gray-700 font-medium">{b.startTime || '--:--'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                b.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 
                                                b.status === 'CheckedIn' ? 'bg-purple-100 text-purple-700' :
                                                b.status === 'Queued' ? 'bg-indigo-100 text-indigo-700' :
                                                b.status === 'InProgress' ? 'bg-amber-100 text-amber-700' :
                                                b.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                b.status === 'CheckedOut' ? 'bg-green-100 text-green-700' :
                                                b.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                                                'bg-gray-100 text-gray-700'
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
