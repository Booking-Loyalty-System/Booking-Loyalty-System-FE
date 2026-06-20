import React, { useState } from 'react';
import { 
    Clock, 
    PlayCircle, 
    CheckCircle, 
    Car, 
    ChevronRight, 
    MoreHorizontal,
    User,
    CalendarDays
} from 'lucide-react';
import { useStaffDashboard } from '../../../application/useStaffDashboard';
import { useAuth } from '../../../application/useAuth';
import { type BookingResponseData } from '../../../domain/models/booking/booking.model';
import { toast } from 'sonner';
import { CheckoutSummaryModal } from '../../components/staff/CheckoutSummaryModal';

type StaffAction = 'checkIn' | 'queue' | 'start' | 'finish' | 'checkout';

export const StaffQueuePage: React.FC = () => {
    const { user } = useAuth();
    const { bookings, isLoading, actions } = useStaffDashboard();
    const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState<BookingResponseData | null>(null);
    
    // 🌟 BỘ LỌC CHI NHÁNH PHÍA CLIENT: Cho phép lọc xe hiển thị theo chi nhánh được chọn
    const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
    const BRANCHES = [
        { id: 'all', name: 'All Branches' },
        { id: 'b1', name: 'Chi nhánh Cầu Giấy' },
        { id: 'b2', name: 'Chi nhánh Đống Đa' },
        { id: 'b3', name: 'Chi nhánh Hai Bà Trưng' },
    ];

    const filteredBookings = selectedBranchId === 'all' 
        ? bookings 
        : bookings.filter(b => b.branchId === selectedBranchId);

    const handleAction = async (id: string, action: StaffAction) => {
        try {
            // Sử dụng actions.updateStatus để đồng bộ với hook useStaffDashboard mới
            // Mỗi action tương ứng với một targetStatus quy định bởi Backend
            switch(action) {
                case 'checkIn': 
                    await actions.updateStatus({ id, payload: { targetStatus: 2, staffId: user?.id } }); 
                    break;
                case 'queue': 
                    await actions.updateStatus({ id, payload: { targetStatus: 3 } }); 
                    break;
                case 'start': 
                    await actions.updateStatus({ id, payload: { targetStatus: 4, staffId: user?.id || 'current-staff-id' } }); 
                    break;
                case 'finish': 
                    await actions.updateStatus({ id, payload: { targetStatus: 5 } }); 
                    break;
                case 'checkout': {
                    const booking = bookings.find(b => b.id === id);
                    if (booking) setSelectedBookingForCheckout(booking);
                    return;
                }
            }
            toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} successful!`);
        } catch (error) {
            console.error(error);
            toast.error(`Failed to perform ${action}`);
        }
    };

    const confirmCheckout = async () => {
        if (!selectedBookingForCheckout) return;
        try {
            // Checkout tương ứng với targetStatus: 7
            await actions.updateStatus({ 
                id: selectedBookingForCheckout.id, 
                payload: { targetStatus: 7, reason: 'Checked out by staff' } 
            });
            toast.success('Checkout completed and points awarded!');
            setSelectedBookingForCheckout(null);
        } catch (error) {
            console.error(error);
            toast.error('Checkout failed');
        }
    };

    // Filter bookings into columns
    const columns = [
        { 
            title: 'Incoming', 
            icon: <CalendarDays className="w-5 h-5 text-slate-600" />,
            status: ['Confirmed'],
            bg: 'bg-slate-50',
            border: 'border-slate-100',
            buttonLabel: 'Check-In',
            action: 'checkIn' as const
        },
        { 
            title: 'Checked In', 
            icon: <Clock className="w-5 h-5 text-purple-600" />,
            status: ['CheckedIn'],
            bg: 'bg-purple-50',
            border: 'border-purple-100',
            buttonLabel: 'Send to Queue',
            action: 'queue' as const
        },
        { 
            title: 'InProgress', 
            icon: <PlayCircle className="w-5 h-5 text-blue-600" />,
            status: ['Queued', 'InProgress'],
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            buttonLabel: (status: string) => status === 'Queued' ? 'Start Washing' : 'Finish Wash',
            action: (status: string): StaffAction => status === 'Queued' ? 'start' : 'finish'
        },
        { 
            title: 'Completed', 
            icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
            status: ['Completed'],
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            buttonLabel: () => 'Checkout',
            action: (): StaffAction => 'checkout'
        }
    ];

    if (isLoading) return <div className="p-8 text-center font-bold text-gray-500">Loading Queue...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Live Queue Monitor</h1>
                    <p className="text-gray-500 font-bold">Manage vehicle workflow in real-time</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Select box lọc chi nhánh phía client */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Branch:</span>
                        <select 
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-xl font-bold p-2 focus:ring-blue-500 focus:border-blue-500 block"
                        >
                            {BRANCHES.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <div className="flex -space-x-2">
                            {[1, 2].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[9px] font-black text-blue-600">
                                    S{i}
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">2 Staff Active</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
                {columns.map((col) => {
                    const columnBookings = filteredBookings.filter(b => col.status.includes(b.status));
                    
                    return (
                        <div key={col.title} className={`${col.bg} rounded-[32px] p-6 border-2 ${col.border} flex flex-col`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-xl shadow-sm">
                                        {col.icon}
                                    </div>
                                    <h3 className="font-black text-gray-900 tracking-tight">{col.title}</h3>
                                </div>
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-gray-600 shadow-sm border border-gray-100">
                                    {columnBookings.length}
                                </span>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                {columnBookings.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-40 border-2 border-dashed border-gray-200 rounded-3xl p-8">
                                        <Car className="w-12 h-12 mb-4 text-gray-300" />
                                        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">No bookings</p>
                                    </div>
                                ) : (
                                    columnBookings.map(booking => {
                                        const action = typeof col.action === 'function' ? col.action(booking.status) : col.action;
                                        const label = typeof col.buttonLabel === 'function' ? col.buttonLabel(booking.status) : col.buttonLabel;
                                        
                                        return (
                                            <div 
                                                key={booking.id} 
                                                className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group animate-in fade-in slide-in-from-bottom-2 duration-300 ${booking.status === 'InProgress' ? 'ring-2 ring-amber-500 ring-offset-2 animate-pulse' : ''}`}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex flex-col gap-1">
                                                        <code className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">
                                                            #{booking.bookingCode}
                                                        </code>
                                                        <span className="text-[10px] font-bold text-gray-400">{booking.startTime}</span>
                                                    </div>
                                                    <button className="text-gray-300 hover:text-gray-500">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                                            <Car className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 leading-tight">{booking.licensePlate}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{booking.serviceName || 'Standard Wash'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-600">Customer</p>
                                                            <p className="text-[10px] text-gray-400 font-medium">Gold Member</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => handleAction(booking.id, action)}
                                                    className={`w-full mt-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                                                        action === 'checkIn' ? 'bg-slate-800 text-white hover:bg-black shadow-slate-200' :
                                                        action === 'queue' ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100' :
                                                        action === 'start' ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-100' :
                                                        action === 'finish' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100' :
                                                        'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
                                                    } shadow-lg`}
                                                >
                                                    {label}
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

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
