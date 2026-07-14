import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import { StaffImageUploader } from "./StaffImageUploader";

interface ActionImageModalProps {
  bookingId: string;
  actionType: "checkIn" | "finish";
  onClose: () => void;
  onConfirm: () => void;
}

export const ActionImageModal: React.FC<ActionImageModalProps> = ({
  bookingId,
  actionType,
  onClose,
  onConfirm,
}) => {
  const isCheckIn = actionType === "checkIn";
  const imageType = isCheckIn ? "BeforeWash" : "AfterWash";
  const title = isCheckIn
    ? "Ảnh Nhận xe (Check-in)"
    : "Ảnh Hoàn thành (Bàn giao)";

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111] rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col transform animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3 p-3 mb-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
              {isCheckIn ? "Đã nhận xe thành công." : "Đã bàn giao thành công."}{" "}
              Vui lòng tải thêm ảnh minh chứng cho xe này.
            </p>
          </div>

          {/* Integrate the Uploader */}
          <StaffImageUploader bookingId={bookingId} type={imageType} />
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:bg-blue-700"
          >
            <CheckCircle2 className="w-5 h-5" />
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};
