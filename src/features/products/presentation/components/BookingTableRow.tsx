import type { DashboardBooking } from "@/features/products/presentation/components/DashboardStats.tsx";
import {
  Ban,
  Car,
  ChevronRight,
  Clock,
  ThumbsUp,
  XCircle,
  Camera,
} from "lucide-react";

interface BookingTableRowProps {
  booking: DashboardBooking;
  handleAction: (
    id: string,
    action: "confirm" | "checkIn" | "checkout" | "staffCancel" | "noShow",
  ) => void;
  onViewDetail: () => void;
  onViewImages: () => void;
}

export const BookingTableRow: React.FC<BookingTableRowProps> = ({
  booking: b,
  handleAction,
  onViewDetail,
  onViewImages,
}) => {
  return (
    <tr
      onClick={onViewDetail}
      className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors group cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-0"
    >
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 font-mono text-sm font-bold">
          {b.bookingCode || "N/A"}
        </div>
      </td>

      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
            <Car className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {b.vehicleName}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              BSX:{" "}
              <span className="text-slate-700 dark:text-slate-300">
                {b.licensePlate}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="py-4 px-6">
        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {b.serviceName}
        </div>
        <div className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded">
          <Clock className="w-3 h-3 text-slate-400" />
          {b.startTime}
        </div>
      </td>

      <td className="py-4 px-6">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset ${
            b.status === "Pending"
              ? "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400"
              : b.status === "Confirmed"
                ? "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400"
                : b.status === "CheckedIn"
                  ? "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : b.status === "Queued"
                    ? "bg-cyan-50 text-cyan-700 ring-cyan-600/20 dark:bg-cyan-500/10 dark:text-cyan-400"
                    : b.status === "InProgress"
                      ? "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400"
                      : b.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : b.status === "CheckedOut"
                          ? "bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-500/10 dark:text-teal-400"
                          : b.status === "Cancelled" || b.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400"
                            : b.status === "NoShow"
                              ? "bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-white/10 dark:text-slate-300"
                              : "bg-slate-50 text-slate-700 ring-slate-500/20 dark:bg-white/5 dark:text-slate-400"
          }`}
        >
          {b.status}
        </span>
      </td>

      <td className="py-4 px-6 text-right">
        <div className="flex justify-end gap-2 flex-wrap">
          {b.status === "Pending" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(b.id, "confirm");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 rounded-lg text-xs font-bold transition-colors"
              >
                Xác nhận <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(b.id, "staffCancel");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors"
              >
                Hủy <XCircle className="w-3 h-3" />
              </button>
            </>
          )}

          {b.status === "Confirmed" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(b.id, "checkIn");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 rounded-lg text-xs font-bold transition-colors"
              >
                Check-in <ChevronRight className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(b.id, "noShow");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:bg-white/10 dark:text-stone-300 dark:hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
              >
                Vắng <Ban className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(b.id, "staffCancel");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors"
              >
                Hủy <XCircle className="w-3 h-3" />
              </button>
            </>
          )}

          {b.status === "Completed" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewImages();
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
              >
                <Camera className="w-3 h-3" /> Ảnh
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(b.id, "checkout");
                }}
                className="inline-flex items-center gap-1 px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-sm rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5"
              >
                Thanh toán
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
