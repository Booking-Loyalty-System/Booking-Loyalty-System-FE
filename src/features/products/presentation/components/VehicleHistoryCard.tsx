import React from "react";
import { X, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useBooking } from "@/features/products/application/useBooking.ts";

interface VehicleHistoryCardProps {
  licensePlate: string;
  vehicleName: string;
  onClose: () => void;
}

export const VehicleHistoryCard: React.FC<VehicleHistoryCardProps> = ({
  licensePlate,
  vehicleName,
  onClose,
}) => {
  const { myBookings, isFetchingBookings } = useBooking();
  const carBookings = myBookings.filter(
    (b) => b.vehiclePlate?.toLowerCase() === licensePlate.toLowerCase(),
  );

  return (
    // 💡 Wrapper ngoài cùng tạo nền đen mờ, đè lên toàn bộ màn hình (z-50)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Khung nội dung chính của Modal */}
      <div className="bg-white dark:bg-[#13151A] rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 dark:border-white/10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header (Cố định ở trên) */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Service History
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              {vehicleName} —{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold">{licensePlate}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung danh sách (Có thể cuộn) */}
        <div className="p-6 overflow-y-auto">
          {isFetchingBookings ? (
            <div className="py-10 text-center text-slate-400 text-sm font-medium animate-pulse">
              Loading history...
            </div>
          ) : carBookings.length > 0 ? (
            <div className="space-y-3">
              {carBookings.map((history) => (
                <div
                  key={history.id}
                  className="p-4 border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 rounded-xl hover:border-blue-100 dark:hover:border-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-bold">
                        #{history.bookingCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                        {history.washPackageName}
                      </h4>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(history.totalPrice)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-2 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {history.bookingDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {history.startTime} -{" "}
                      {history.endTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-white/5 pt-2 mt-2">
                    <p className="text-xs text-slate-400 font-medium truncate max-w-[150px]">
                      {history.washBayName || "Auto Wash Bay"}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      {history.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400">
              <p className="text-sm font-medium">
                No service history found for this vehicle.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
