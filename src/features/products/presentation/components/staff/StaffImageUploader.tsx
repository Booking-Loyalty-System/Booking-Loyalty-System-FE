import { useState } from "react";
import { uploadBookingImage, type BookingImageType } from "../../../../../services/bookingImage";
import { Loader2, UploadCloud, CheckCircle2, Image as ImageIcon } from "lucide-react";

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
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const img = await uploadBookingImage(file, bookingId, type, undefined, token);
      setSavedUrl(img.imageUrl);
      setFile(null);
      if (onSuccess) onSuccess(img.imageUrl);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Upload thất bại, thử lại.");
    } finally {
      setBusy(false);
    }
  }

  if (savedUrl) {
    return (
      <div className="flex flex-col items-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
        <p className="text-sm font-semibold text-emerald-700">Đã tải ảnh {type === "BeforeWash" ? "trước khi rửa" : "sau khi rửa"} thành công</p>
        <img src={savedUrl} alt="Đã lưu" className="mt-3 rounded-lg max-h-32 object-cover border border-emerald-200 shadow-sm" />
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

      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer transition-colors"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={busy}
        />

        {file && (
          <div className="flex items-center gap-3 mt-2">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-sm"
            />
            <button
              disabled={busy}
              onClick={handleUpload}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-md shadow-blue-100"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Xác nhận tải
                </>
              )}
            </button>
          </div>
        )}

        {error && <p className="text-xs font-semibold text-rose-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}
