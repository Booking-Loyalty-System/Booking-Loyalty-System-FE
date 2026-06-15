import React, { useState } from 'react';
import { CheckCircle, Calendar, Droplets } from 'lucide-react';
import { useStaffDashboard } from '../../../application/useStaffDashboard';
import { toast } from 'sonner';
import { CheckoutSummaryModal } from '../../components/staff/CheckoutSummaryModal';
import { type BookingResponseData } from '../../../domain/models/booking/booking.model';

export const StaffDashboard: React.FC = () => {
    // Lấy dữ liệu và các hàm thao tác từ hook dashboard
    const { bookings, isLoading, actions } = useStaffDashboard();
    
    // State quản lý việc hiển thị modal thanh toán và tìm kiếm
    const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState<BookingResponseData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // Lọc danh sách hiển thị dựa trên từ khóa và bộ lọc trạng thái
    const filteredBookings = bookings.filter(b => {
        const matchesSearch = b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (b.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Hàm xử lý các thao tác vận hành (Check-in, Queue, Start, Finish, Checkout)
    const handleAction = async (id: string, action: 'checkIn' | 'queue' | 'start' | 'finish' | 'checkout') => {
        try {
            switch(action) {
                case 'checkIn': await actions.checkIn(id); break;
                case 'queue': await actions.queue(id); break;
                case 'start': await actions.start({ id, staffId: 'current-staff-id' }); break;
                case 'finish': await actions.finish(id); break;
                case 'checkout': {
                    const booking = bookings.find(b => b.id === id);
                    if (booking) setSelectedBookingForCheckout(booking);
                    return;
                }
            }
            toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} thành công!`);
        } catch (error) {
            console.error(error);
            toast.error(`Thao tác ${action} thất bại`);
        }
    };

    // Hàm xác nhận hoàn tất thanh toán (Checkout)
    const confirmCheckout = async () => {
        if (!selectedBookingForCheckout) return;
        try {
            await actions.checkout(selectedBookingForCheckout.id);
            toast.success('Thanh toán hoàn tất và đã cộng điểm cho khách!');
            setSelectedBookingForCheckout(null);
        } catch (error) {
            console.error(error);
            toast.error('Thanh toán thất bại');
        }
    };

    // Hiển thị skeleton loading
    if (isLoading) return (
        <div className="p-8 space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
            
            {/* Hàng thẻ thống kê (Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Tổng số lịch trong ngày */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase rounded-full tracking-wider">Hôm nay</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 mb-1">{bookings.length}</p>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-tight mb-4">Tổng Booking</p>
                    <button className="w-full py-2 bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-blue-100 transition-colors">
                        Xem chi tiết
                    </button>
                </div>

                {/* Các ca đã xong */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 mb-1">
                        {bookings.filter(b => b.status === 'Completed' || b.status === 'CheckedOut').length}
                    </p>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Đã hoàn thành</p>
                </div>

                {/* Các ca đang thực hiện */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <Droplets className="w-8 h-8 text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 mb-1">
                        {bookings.filter(b => b.status === 'InProgress').length}
                    </p>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Đang rửa xe</p>
                </div>

                {/* Hàng đợi chờ */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 mb-1">
                        {bookings.filter(b => b.status === 'Confirmed' || b.status === 'Queued').length}
                    </p>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Hàng đợi chờ</p>
                </div>
            </div>

            {/* Danh sách Booking hôm nay */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900">Lịch đặt hôm nay</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Tìm mã/biển số..." 
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select 
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">Tất cả</option>
                            <option value="Confirmed">Chờ xác nhận</option>
                            <option value="CheckedIn">Đã đến</option>
                            <option value="Queued">Trong hàng đợi</option>
                            <option value="InProgress">Đang rửa</option>
                            <option value="Completed">Hoàn thành</option>
                        </select>
                    </div>
                </div>
                {filteredBookings.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="font-semibold">Không tìm thấy lịch nào</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="py-4 px-6">Mã Booking</th>
                                <th className="py-4 px-6">Trạng thái</th>
                                <th className="py-4 px-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredBookings.map(b => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-gray-900">{b.bookingCode}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            b.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 
                                            b.status === 'CheckedIn' ? 'bg-purple-100 text-purple-700' :
                                            b.status === 'InProgress' ? 'bg-amber-100 text-amber-700' :
                                            b.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {b.status === 'Confirmed' && <button onClick={() => handleAction(b.id, 'checkIn')} className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800">Check-in</button>}
                                            {b.status === 'CheckedIn' && <button onClick={() => handleAction(b.id, 'queue')} className="text-xs font-black uppercase tracking-widest text-purple-600 hover:text-purple-800">Hàng đợi</button>}
                                            {b.status === 'Queued' && <button onClick={() => handleAction(b.id, 'start')} className="text-xs font-black uppercase tracking-widest text-amber-600 hover:text-amber-800">Bắt đầu</button>}
                                            {b.status === 'InProgress' && <button onClick={() => handleAction(b.id, 'finish')} className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800">Hoàn tất</button>}
                                            {b.status === 'Completed' && <button onClick={() => handleAction(b.id, 'checkout')} className="text-xs font-black uppercase tracking-widest text-gray-900 hover:text-gray-700">Thanh toán</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal hiển thị khi chọn Thanh toán (Checkout) */}
            {selectedBookingForCheckout && (
                <CheckoutSummaryModal 
                    booking={selectedBookingForCheckout}
                    onClose={() => setSelectedBookingForCheckout(null)}
                    onConfirm={confirmCheckout}
                />
            )}
        </div>
    );
};
