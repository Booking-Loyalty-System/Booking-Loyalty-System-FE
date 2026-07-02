import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {MyBookingRecord} from "@/features/products/domain/models/booking/booking.model.ts";
import {CheckCircle2} from "lucide-react";
import { useTranslation } from 'react-i18next';

interface BookingSuccessCardProps {
    booking: MyBookingRecord;
    formatCurrency: (amount: number) => string;
}

export const BookingSuccessCard: React.FC<BookingSuccessCardProps> = ({ booking, formatCurrency }) => {
    // Sử dụng hook useTranslation để lấy hàm t() dịch text theo ngôn ngữ hiện tại
    const { t } = useTranslation('customer');

    useEffect(() => {
        const duration = 3000; // Pháo hoa bắn liên tục trong 3 giây
        const end = Date.now() + duration;

        const frame = () => {
            // Bắn từ góc trái màn hình hướng lên
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
            });
            // Bắn từ góc phải màn hình hướng lên
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, [booking]);

    return (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm mb-2 animate-fade-in">
            <h2 className="text-xl font-black text-emerald-700 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                {t('bookWash.successCard.title')}
            </h2>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-slate-600">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t('bookWash.successCard.bookingCode')}
                    </p>
                    <p className="font-mono font-bold text-blue-600 mt-0.5">{booking.bookingCode}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t('bookWash.successCard.servicePackage')}
                    </p>
                    <p className="font-bold text-slate-900 mt-0.5">{booking.washPackageName}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t('bookWash.successCard.time')}
                    </p>
                    <p className="text-slate-700 mt-0.5">{booking.bookingDate} ({booking.startTime})</p>
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t('bookWash.successCard.totalAmount')}
                    </p>
                    <p className="font-extrabold text-slate-900 mt-0.5">{formatCurrency(booking.totalPrice)}</p>
                </div>
            </div>
        </div>
    );
};