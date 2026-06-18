import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2, Calendar, Car, Clock, ShieldCheck } from 'lucide-react';
import type { MyBookingRecord } from '../../domain/models/booking/booking.model.ts';

interface Props {
    booking: MyBookingRecord | null;
    onClose: () => void;
}

export const BookingDetailModal: React.FC<Props> = ({ booking, onClose }) => {
    if (!booking) return null;

    const qrValue = booking.bookingCode || booking.id || "";
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Chi tiết đặt lịch</h2>
                    <p className="font-mono font-bold text-blue-600">{booking.bookingCode}</p>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <QRCodeSVG
                            value={qrValue}
                            size={160}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2 border-slate-100">
                        <span className="text-slate-400 flex items-center gap-2"><Car size={16}/> Xe</span>
                        <span className="font-bold text-slate-900">{booking.vehicleName} ({booking.vehiclePlate})</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-slate-100">
                        <span className="text-slate-400 flex items-center gap-2"><Calendar size={16}/> Ngày</span>
                        <span className="font-bold text-slate-900">{booking.bookingDate}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-slate-100">
                        <span className="text-slate-400 flex items-center gap-2"><Clock size={16}/> Giờ</span>
                        <span className="font-bold text-slate-900">{booking.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400 flex items-center gap-2"><ShieldCheck size={16}/> Gói</span>
                        <span className="font-bold text-slate-900">{booking.washPackageName}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};