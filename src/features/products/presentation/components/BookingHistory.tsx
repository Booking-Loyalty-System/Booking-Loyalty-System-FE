import React, { useState } from 'react';
import { Calendar, Star, Clock, DollarSign, Search, Filter, Download, ArrowRight, ArrowLeft, XCircle } from 'lucide-react';

interface BookingRecord {
    id: string;
    service: string;
    dateTime: string;
    timeSlot: string;
    vehicle: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
    points: string;
    amount: number;
}

export const BookingHistory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const stats = [
        { title: 'Total Bookings', value: '24', icon: <Calendar className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50/50' },
        { title: 'Points Earned', value: '850', icon: <Star className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50/50' },
        { title: 'Minutes Saved', value: '1,440', icon: <Clock className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50/50' },
        { title: 'Total Spent', value: '$567', icon: <DollarSign className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50/50' },
    ];

    const bookings: BookingRecord[] = [
        { id: 'BK12347', service: 'Premium Wash', dateTime: 'May 20, 2026', timeSlot: '10:00 AM', vehicle: 'ABC-1234', status: 'Scheduled', points: '-', amount: 38.25 },
        { id: 'BK12346', service: 'Basic Wash', dateTime: 'May 18, 2026', timeSlot: '02:00 PM', vehicle: 'ABC-1234', status: 'Scheduled', points: '-', amount: 21.25 },
        { id: 'BK12339', service: 'Ceramic Wash', dateTime: 'April 25, 2026', timeSlot: '01:00 PM', vehicle: 'ABC-1234', status: 'Completed', points: '+85', amount: 72.25 },
        { id: 'BK12338', service: 'Basic Wash', dateTime: 'April 20, 2026', timeSlot: '04:00 PM', vehicle: 'ABC-1234', status: 'Completed', points: '+25', amount: 21.25 },
    ];

    return (
        <div className="w-full space-y-6 font-sans antialiased text-slate-800">
            {/* Khối Thẻ Thống Kê Đầu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className={`p-3.5 rounded-xl ${stat.bg} shrink-0`}>
                            {stat.icon}
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Thanh Tìm Kiếm Và Bộ Lọc Điều Hướng */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by booking ID, vehicle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 focus:outline-none focus:border-blue-500">
                        <option>All Services</option>
                    </select>
                    <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 focus:outline-none focus:border-blue-500">
                        <option>All Status</option>
                    </select>
                    <button className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 bg-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition">
                        <Download className="w-4 h-4 text-slate-400" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Bảng Dữ Liệu Lịch Sử */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="py-4 px-6">Booking ID</th>
                            <th className="py-4 px-6">Service</th>
                            <th className="py-4 px-6">Date & Time</th>
                            <th className="py-4 px-6">Vehicle</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6">Points</th>
                            <th className="py-4 px-6">Amount</th>
                            <th className="py-4 px-6 text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                        {bookings.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                                <td className="py-4 px-6 font-mono font-bold text-blue-600">{item.id}</td>
                                <td className="py-4 px-6 text-slate-900 font-bold">{item.service}</td>
                                <td className="py-4 px-6">
                                    <div>{item.dateTime}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{item.timeSlot}</div>
                                </td>
                                <td className="py-4 px-6 font-semibold">{item.vehicle}</td>
                                <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {item.status}
                    </span>
                                </td>
                                <td className={`py-4 px-6 font-bold ${item.points.startsWith('+') ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {item.points}
                                </td>
                                <td className="py-4 px-6 font-extrabold text-slate-900">${item.amount.toFixed(2)}</td>
                                <td className="py-4 px-6 text-right space-x-3">
                                    <button className="text-blue-600 hover:text-blue-700 font-bold text-xs">View Details</button>
                                    {item.status === 'Scheduled' && (
                                        <button className="text-rose-500 hover:text-rose-600 font-bold text-xs inline-flex items-center gap-0.5">
                                            <XCircle className="w-3.5 h-3.5" />
                                            <span>Cancel</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Khối Phân Trang */}
                <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
                    <div>Showing <span className="text-slate-800 font-bold">1-8</span> of <span className="text-slate-800 font-bold">24</span> bookings</div>
                    <div className="flex items-center gap-1.5">
                        <button className="inline-flex items-center gap-1 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition text-slate-400 cursor-not-allowed">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Previous</span>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">1</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition">2</button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition">3</button>
                        <button className="inline-flex items-center gap-1 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition text-slate-600">
                            <span>Next</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};