import React, { useState } from 'react';
import { Star, X, Send, Loader2 } from 'lucide-react';
import { useFeedback } from '@/features/products/application/useFeedback';

interface FeedbackModalProps {
    bookingId: string;
    bookingCode: string;
    onClose: () => void;
}

interface StarRatingProps {
    label: string;
    value: number;
    onChange: (v: number) => void;
    hovered: number;
    onHover: (v: number) => void;
    onLeave: () => void;
}

const StarRating: React.FC<StarRatingProps> = ({ label, value, onChange, hovered, onHover, onLeave }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600 w-24">{label}</span>
        <div className="flex gap-1" onMouseLeave={onLeave}>
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => onHover(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                >
                    <Star
                        className={`w-7 h-7 transition-colors ${
                            star <= (hovered || value)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-100 text-slate-300'
                        }`}
                    />
                </button>
            ))}
        </div>
        <span className="text-xs text-slate-400 w-8 text-right">
            {value > 0 ? `${value}/5` : '–'}
        </span>
    </div>
);

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ bookingId, bookingCode, onClose }) => {
    const { submitFeedback, isSubmitting } = useFeedback();

    const [serviceRating, setServiceRating] = useState(0);
    const [staffRating, setStaffRating]     = useState(0);
    const [priceRating, setPriceRating]     = useState(0);
    const [comment, setComment]             = useState('');

    const [hoveredService, setHoveredService] = useState(0);
    const [hoveredStaff, setHoveredStaff]     = useState(0);
    const [hoveredPrice, setHoveredPrice]     = useState(0);

    const isValid = serviceRating > 0 && staffRating > 0 && priceRating > 0;

    const handleSubmit = async () => {
        if (!isValid) return;
        try {
            await submitFeedback({ bookingId, serviceRating, staffRating, priceRating, comment });
            onClose();
        } catch {
            // Lỗi đã được xử lý và hiển thị toast trong useFeedback
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Star className="w-5 h-5 fill-white text-white" />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">Đánh giá dịch vụ</h2>
                    </div>
                    <p className="text-sm text-blue-100">
                        Booking <span className="font-mono font-bold text-white">{bookingCode}</span>
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    <p className="text-sm text-slate-500 font-medium">
                        Trải nghiệm của bạn với chúng tôi như thế nào? Đánh giá của bạn giúp chúng tôi cải thiện dịch vụ!
                    </p>

                    {/* Rating rows */}
                    <div className="space-y-4 py-2">
                        <StarRating
                            label="Dịch vụ"
                            value={serviceRating}
                            onChange={setServiceRating}
                            hovered={hoveredService}
                            onHover={setHoveredService}
                            onLeave={() => setHoveredService(0)}
                        />
                        <div className="border-t border-slate-50" />
                        <StarRating
                            label="Nhân viên"
                            value={staffRating}
                            onChange={setStaffRating}
                            hovered={hoveredStaff}
                            onHover={setHoveredStaff}
                            onLeave={() => setHoveredStaff(0)}
                        />
                        <div className="border-t border-slate-50" />
                        <StarRating
                            label="Giá cả"
                            value={priceRating}
                            onChange={setPriceRating}
                            hovered={hoveredPrice}
                            onHover={setHoveredPrice}
                            onLeave={() => setHoveredPrice(0)}
                        />
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Bình luận (tuỳ chọn)
                        </label>
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                            rows={3}
                            maxLength={500}
                            className="w-full border border-slate-200 rounded-2xl p-3.5 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                        />
                        <p className="text-right text-xs text-slate-400 mt-1">{comment.length}/500</p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold py-3 px-4 rounded-xl text-sm transition-all disabled:opacity-50"
                        >
                            Để sau
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid || isSubmitting}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Đang gửi...</>
                            ) : (
                                <><Send className="w-4 h-4" /> Gửi đánh giá</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
