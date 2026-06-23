import type {DashboardBooking} from "@/features/products/presentation/components/DashboardStats.tsx";
import {Ban, Car, ChevronRight, Clock, ThumbsUp, XCircle} from "lucide-react";

interface BookingTableRowProps {
    booking: DashboardBooking;
    handleAction: (id: string, action: 'confirm' | 'checkIn' | 'checkout' | 'staffCancel' | 'noShow') => void;
    onViewDetail: () => void;
}

export const BookingTableRow: React.FC<BookingTableRowProps> = ({ booking: b, handleAction, onViewDetail }) => {
    return (
        <tr onClick={onViewDetail} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
            <td className="py-4 px-6 whitespace-nowrap">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 font-mono text-sm font-bold">
                    {b.bookingCode || "N/A"}
                </div>
            </td>

            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Car className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-sm">{b.vehicleName}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">
                            BSX: <span className="text-slate-700">{b.licensePlate}</span>
                        </div>
                    </div>
                </div>
            </td>

            <td className="py-4 px-6">
                <div className="text-sm font-bold text-slate-800">{b.serviceName}</div>
                <div className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {b.startTime}
                </div>
            </td>

            <td className="py-4 px-6">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                    b.status === 'Pending' ? 'bg-orange-50 text-orange-700 ring-orange-600/20' :
                        b.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                            b.status === 'CheckedIn' ? 'bg-purple-50 text-purple-700 ring-purple-600/20' :
                                b.status === 'Queued' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' :
                                    b.status === 'InProgress' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                                        b.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                                            b.status === 'CheckedOut' ? 'bg-slate-50 text-slate-600 ring-slate-500/20' :
                                                b.status === 'Cancelled' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                    b.status === 'NoShow' ? 'bg-stone-50 text-stone-700 ring-stone-600/20' :
                                                        'bg-slate-50 text-slate-700 ring-slate-500/20'
                }`}>
                    {b.status}
                </span>
            </td>

            <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2 flex-wrap">
                    {b.status === 'Pending' && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAction(b.id, 'confirm'); }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                            >
                                Xác nhận <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAction(b.id, 'staffCancel'); }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                            >
                                Hủy <XCircle className="w-3 h-3" />
                            </button>
                        </>
                    )}

                    {b.status === 'Confirmed' && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAction(b.id, 'checkIn'); }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                            >
                                Check-in <ChevronRight className="w-3 h-3" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAction(b.id, 'noShow'); }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-50 text-stone-700 hover:bg-stone-100 rounded-lg text-xs font-bold transition-colors"
                            >
                                Vắng <Ban className="w-3 h-3" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAction(b.id, 'staffCancel'); }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                            >
                                Hủy <XCircle className="w-3 h-3" />
                            </button>
                        </>
                    )}

                    {b.status === 'Completed' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAction(b.id, 'checkout'); }}
                            className="inline-flex items-center gap-1 px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 shadow-sm rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
                        >
                            Thanh toán
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};