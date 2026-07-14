import { useState } from "react";
import {
  uploadBookingImage,
  type BookingImageType,
} from "../../../../../services/bookingImage";
import { Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";

export function StaffImageUploader({
  bookingId,
  type,
  onSuccess,
}: {
  bookingId: string;
  type: BookingImageType;
  onSuccess?: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedUrls, setSavedUrls] = useState<string[]>([]);

  async function handleAutoUpload(files: FileList) {
    setBusy(true);
    setError(null);
    try {
      const uploadPromises = Array.from(files).map(
        (file) => uploadBookingImage(file, bookingId, type, undefined), // ĐÃ XÓA token ở đây
      );

      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((img) => img.imageUrl);

      setSavedUrls((prev) => {
        const updatedUrls = [...prev, ...newUrls];
        if (onSuccess) onSuccess(updatedUrls);
        return updatedUrls;
      });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Upload thất bại, thử lại.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mt-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-blue-500" />
        <h4 className="text-sm font-bold text-slate-700">
          Tải ảnh {type === "BeforeWash" ? "trước khi rửa" : "sau khi rửa"}
        </h4>
      </div>

      {savedUrls.length > 0 && (
        <div className="flex flex-col gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-in zoom-in duration-300">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-semibold text-emerald-700">
              Đã tải {savedUrls.length} ảnh{" "}
              {type === "BeforeWash" ? "trước khi rửa" : "sau khi rửa"} thành
              công
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {savedUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Đã lưu ${index + 1}`}
                className="rounded-lg h-20 w-full object-cover border border-emerald-200 shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 relative">
        <input
          type="file"
          accept="image/*"
          multiple
          className={`text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 cursor-pointer transition-colors ${
            busy ? "opacity-50 pointer-events-none" : "hover:file:bg-blue-200"
          }`}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) handleAutoUpload(files);
          }}
          disabled={busy}
        />

        {busy && (
          <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[1px] flex items-center justify-start pl-2 rounded-lg z-10">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100">
              <Loader2 className="w-4 h-4 animate-spin" />
              {/* ĐÃ SỬA: Firebase -> hệ thống */}
              Đang tải ảnh lên...
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs font-semibold text-rose-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}
