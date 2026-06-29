import {Calendar, CheckCircle, Clock, Droplets} from "lucide-react";
import type {BookingResponseData} from "@/features/products/domain/models/booking/booking.model.ts";

export interface DashboardBooking extends Omit<BookingResponseData, 'status'> {
    status: 'Pending' | 'Confirmed' | 'CheckedIn' | 'Queued' | 'InProgress' | 'Completed' | 'CheckedOut' | 'Cancelled' | 'NoShow' | string;
    bookingCode: string;
    vehicleName: string;
    licensePlate: string;
    serviceName: string;
    startTime: string;
    bookingDate: string;
}

interface DashboardStatsProps {
    bookings: DashboardBooking[];
    localDate: string;
    setLocalDate: (date: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ bookings, localDate, setLocalDate }) => {
    const completedCount = bookings.filter(b => b.status === 'Completed' || b.status === 'CheckedOut').length;
    const inProgressCount = bookings.filter(b => b.status === 'InProgress').length;
    const waitingCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Queued' || b.status === 'CheckedIn').length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <input
                        type="date"
                        value={localDate}
                        onChange={(e) => setLocalDate(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
                    />
                </div>
                <div>
                    <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{bookings.length}</p>
                    <p className="text-sm text-slate-500 font-semibold mt-1">Tổng Lịch Đặt</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{completedCount}</p>
                    <p className="text-sm text-slate-500 font-semibold mt-1">Đã Hoàn Thành</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Droplets className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{inProgressCount}</p>
                    <p className="text-sm text-slate-500 font-semibold mt-1">Đang Thực Hiện</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
                <div>
                    <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{waitingCount}</p>
                    <p className="text-sm text-slate-500 font-semibold mt-1">Đang Chờ (Queue)</p>
                </div>
            </div>
        </div>
    );
};