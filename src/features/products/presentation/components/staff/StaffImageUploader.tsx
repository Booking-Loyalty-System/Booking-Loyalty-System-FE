import { useState } from "react";
import {
  uploadBookingImage,
  type BookingImageType,
} from "../../../../../services/bookingImage";
import { Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";

export function StaffImageUploader({
  bookingId,
  type,
  token,
  onSuccess,
}: {
  bookingId: string;
  type: BookingImageType;
  token: string;
  onSuccess?: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  // Nhận file và upload thẳng luôn không qua state trung gian
  async function handleAutoUpload(selectedFile: File) {
    setBusy(true);
    setError(null);
    try {
      const img = await uploadBookingImage(
        selectedFile,
        bookingId,
        type,
        undefined,
        token,
      );
      setSavedUrl(img.imageUrl);
      if (onSuccess) onSuccess(img.imageUrl);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Upload thất bại, thử lại.");
    } finally {
      setBusy(false);
    }
  }

  if (savedUrl) {
    return (
      <div className="flex flex-col items-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-in zoom-in duration-300">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
        <p className="text-sm font-semibold text-emerald-700">
          Đã tải ảnh {type === "BeforeWash" ? "trước khi rửa" : "sau khi rửa"}{" "}
          thành công
        </p>
        <img
          src={savedUrl}
          alt="Đã lưu"
          className="mt-3 rounded-lg max-h-32 object-cover border border-emerald-200 shadow-sm"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl mt-4">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-blue-500" />
        <h4 className="text-sm font-bold text-slate-700">
          Tải ảnh {type === "BeforeWash" ? "trước khi rửa" : "sau khi rửa"}
        </h4>
      </div>

      <div className="flex flex-col gap-2 relative">
        <input
          type="file"
          accept="image/*"
          className={`text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 cursor-pointer transition-colors ${busy ? "opacity-50 pointer-events-none" : "hover:file:bg-blue-200"}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleAutoUpload(file); // Gọi thẳng hàm upload khi có file
          }}
          disabled={busy}
        />

        {/* Lớp overlay hiện loading đè lên input khi đang upload */}
        {busy && (
          <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[1px] flex items-center justify-start pl-2 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tải lên Firebase...
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
