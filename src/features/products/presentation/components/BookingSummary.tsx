import type {BookingSummaryProps} from "@/features/products/domain/models/booking/booking.model.ts";

export const BookingSummary: React.FC<BookingSummaryProps> = ({
                                                                  selectedPackageId, selectedTime, currentVehicle, currentPackage, selectedDateSlot, isBooking, onConfirmBooking, selectedVoucher
                                                              }) => {
    const originalPrice = currentPackage?.price || 0;
    let discountAmount = 0;

    if (selectedVoucher) {
        if (selectedVoucher.isFreeWash) {
            discountAmount = originalPrice;
        } else {
            discountAmount = Math.min(originalPrice, selectedVoucher.discountValue);
        }
    }

    const totalPrice = Math.max(0, originalPrice - discountAmount);

    return (
        <div className="w-full lg:w-80 shrink-0 sticky top-6">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[350px]">
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#0f172a] border-b border-[#f1f5f9] pb-3">Booking Summary</h3>

                    {!selectedPackageId ? (
                        <div className="text-center py-12 text-[#94a3b8] font-medium text-sm px-4">
                            Select a vehicle and wash package to continue
                        </div>
                    ) : (
                        <div className="space-y-4 text-sm">
                            {currentVehicle && (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="block text-xs text-[#94a3b8] font-medium">Vehicle</span>
                                        <span className="font-bold text-[#334155]">{currentVehicle.vehicleName}</span>
                                    </div>
                                    <span className="text-xs font-bold bg-blue-50 text-[#1e6ffd] px-2 py-1 rounded-md">{currentVehicle.licensePlate}</span>
                                </div>
                            )}
                             {currentPackage && (
                                <div className="flex justify-between items-center border-t border-[#f1f5f9] pt-3">
                                    <div>
                                        <span className="block text-xs text-[#94a3b8] font-medium">Wash Package</span>
                                        <span className="font-bold text-[#334155]">{currentPackage.name}</span>
                                    </div>
                                    <span className="font-extrabold text-[#0f172a] text-lg">{originalPrice.toLocaleString('vi-VN')}đ</span>
                                </div>
                            )}
                            <div className="flex flex-col gap-1 border-t border-[#f1f5f9] pt-3">
                                <span className="block text-xs text-[#94a3b8] font-medium">Schedule Time</span>
                                <span className="font-bold text-[#334155]">
                                    {selectedDateSlot?.fullDate} {selectedTime ? `@ ${selectedTime}` : '(Please choose time)'}
                                </span>
                            </div>

                            {/* Voucher Discount Display */}
                            {selectedVoucher && (
                                <div className="flex justify-between items-center border-t border-[#f1f5f9] pt-3 text-emerald-600 font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">Applied Voucher</span>
                                        <span className="text-xs font-bold truncate max-w-[150px]">{selectedVoucher.title}</span>
                                    </div>
                                    <span className="font-bold">-{discountAmount.toLocaleString('vi-VN')}đ</span>
                                </div>
                            )}

                            <div className="border-t border-[#f1f5f9] pt-4 mt-2 flex justify-between items-baseline">
                                <span className="font-bold text-[#0f172a] text-base">Total Estimated:</span>
                                <span className="font-black text-[#1e6ffd] text-2xl">{totalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onConfirmBooking}
                    disabled={!selectedPackageId || !selectedTime || isBooking}
                    className="w-full mt-6 py-3 px-4 rounded-xl bg-[#1e6ffd] hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isBooking ? "Processing..." : "Confirm Booking"}
                </button>
            </div>
        </div>
    );
};