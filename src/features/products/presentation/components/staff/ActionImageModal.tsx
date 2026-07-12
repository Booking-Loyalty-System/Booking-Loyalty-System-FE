import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
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
  const [hasUploaded, setHasUploaded] = useState(false);

  // Retrieve the token. Adjust the key if your app uses a different one (e.g., "token")
  const token = localStorage.getItem("accessToken") || "";

  const isCheckIn = actionType === "checkIn";
  const imageType = isCheckIn ? "BeforeWash" : "AfterWash";
  const title = isCheckIn
    ? "Chụp ảnh Nhận xe (Check-in)"
    : "Chụp ảnh Hoàn thành (Bàn giao)";

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
          <div className="flex items-start gap-3 p-3 mb-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
              Vui lòng tải lên ít nhất 1 hình ảnh minh chứng để có thể tiếp tục
              thao tác này.
            </p>
          </div>

          {/* Integrate the Uploader */}
          <StaffImageUploader
            bookingId={bookingId}
            type={imageType}
            token={token}
            onSuccess={() => setHasUploaded(true)}
          />
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
          >
            Hủy bỏ
          </button>

          <button
            disabled={!hasUploaded}
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed shadow-md hover:bg-blue-700 disabled:shadow-none"
          >
            <CheckCircle2 className="w-5 h-5" />
            {isCheckIn ? "Xác nhận Nhận Xe" : "Xác nhận Bàn Giao"}
          </button>
        </div>
      </div>
    </div>
  );
};
