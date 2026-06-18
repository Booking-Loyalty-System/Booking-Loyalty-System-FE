import React from 'react';
import { X, Sparkles, Award, DollarSign, Receipt } from 'lucide-react';
import { type BookingResponseData } from '../../../domain/models/booking/booking.model';

interface CheckoutSummaryModalProps {
    booking: BookingResponseData;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const CheckoutSummaryModal: React.FC<CheckoutSummaryModalProps> = ({ booking, onClose, onConfirm }) => {
    // Fix: Vì BookingResponseData thực tế không có totalAmount, tạm thời dùng số cứng để làm mock tính toán hóa đơn
    const servicePrice = 100000;

    // Mock customer tier for UI richness - in reality, fetch this from customer profile
    const mockTier = 'Gold';
    const mockDiscount = servicePrice * 0.15; // 15% for Gold
    const finalTotal = servicePrice - mockDiscount;
    const pointsEarned = Math.floor(finalTotal / 1000) * 2; // Mock multiplier

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Checkout Summary</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                        {/* Fix: Đổi sang hiển thị 8 ký tự đầu của id thay cho bookingCode */}
                        <code className="text-lg font-bold text-blue-600">#{booking.id?.substring(0, 8)}</code>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Vehicle</p>
                            {/* Fix: Sử dụng vehicleId thay cho licensePlate */}
                            <p className="font-semibold text-gray-900">{booking.vehicleId || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Service</p>
                            {/* Fix: Sử dụng washPackageId thay cho serviceName để đồng bộ */}
                            <p className="font-semibold text-gray-900">{booking.washPackageId || 'Standard Wash'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 py-2 border-y border-gray-100">
                        <p className="text-sm text-gray-600">Customer Tier:</p>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                            <Award className="w-3 h-3" />
                            {mockTier}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Base Service Price</span>
                            <span className="font-medium">{servicePrice.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span className="text-sm flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                Tier Discount (15%)
                            </span>
                            <span className="font-semibold">-{mockDiscount.toLocaleString()} VND</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="font-bold text-gray-900">Total Payment</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {finalTotal.toLocaleString()} VND
                            </span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-emerald-900">
                            <Sparkles className="w-5 h-5" />
                            <p className="font-bold">Loyalty Points Earned</p>
                        </div>
                        <p className="text-3xl font-black text-emerald-600">{pointsEarned} pts</p>
                        <p className="text-[10px] text-emerald-700 mt-1 uppercase tracking-wider font-semibold">
                            Formula: Final Price × Tier Multiplier (x2.0)
                        </p>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                    <p className="text-xs text-amber-800 flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        <span>Payment will be processed and points added to customer's wallet.</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-[2] py-3 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Complete Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
};