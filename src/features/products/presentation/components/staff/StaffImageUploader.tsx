import { useState } from "react";
import {
  uploadBookingImage,
  deleteBookingImage, // Import thêm hàm xóa
  type BookingImageType,
} from "../../../../../services/bookingImage";
import { Loader2, CheckCircle2, Image as ImageIcon, X } from "lucide-react"; // Import thêm icon X

// Định nghĩa interface để lưu cả id và url
interface UploadedImage {
  id: string;
  url: string;
}

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

  // Sửa state từ mảng string sang mảng object
  const [savedImages, setSavedImages] = useState<UploadedImage[]>([]);

  async function handleAutoUpload(files: FileList) {
    setBusy(true);
    setError(null);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadBookingImage(file, bookingId, type, undefined),
      );

      const results = await Promise.all(uploadPromises);

      // Lấy id và url từ kết quả trả về của hàm uploadBookingImage
      const newImages = results.map((img: any) => ({
        id: img.id || img.imageId, // ID từ API trả về
        url: img.imageUrl,
      }));

      setSavedImages((prev) => {
        const updatedImages = [...prev, ...newImages];
        // Truyền mảng URL ra ngoài component cha (ActionImageModal)
        if (onSuccess) onSuccess(updatedImages.map((img) => img.url));
        return updatedImages;
      });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Upload thất bại, thử lại.");
    } finally {
      setBusy(false);
    }
  }

  // Hàm xử lý khi bấm nút xóa ảnh
  async function handleDeleteImage(imageId: string) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa ảnh này không?")) return;

    setBusy(true);
    setError(null);
    try {
      await deleteBookingImage(bookingId, imageId);

      setSavedImages((prev) => {
        const updatedImages = prev.filter((img) => img.id !== imageId);
        // Cập nhật lại số lượng ảnh ra ngoài component cha để khóa/mở nút "Xong"
        if (onSuccess) onSuccess(updatedImages.map((img) => img.url));
        return updatedImages;
      });
    } catch (e: any) {
      setError("Xóa ảnh thất bại. Vui lòng thử lại.");
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

      {savedImages.length > 0 && (
        <div className="flex flex-col gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-in zoom-in duration-300">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-semibold text-emerald-700">
              Đã tải {savedImages.length} ảnh{" "}
              {type === "BeforeWash" ? "trước khi rửa" : "sau khi rửa"} thành
              công
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {savedImages.map((image, index) => (
              <div key={image.id || index} className="relative group">
                <img
                  src={image.url}
                  alt={`Đã lưu ${index + 1}`}
                  className="rounded-lg h-20 w-full object-cover border border-emerald-200 shadow-sm transition-opacity group-hover:opacity-80"
                />

                {/* Nút Xóa */}
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={busy}
                  className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-sm disabled:opacity-50"
                  title="Xóa ảnh này"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
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
            // Reset giá trị input để có thể chọn lại cùng file nếu vừa xóa
            e.target.value = "";
          }}
          disabled={busy}
        />

        {busy && (
          <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[1px] flex items-center justify-start pl-2 rounded-lg z-10">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xử lý...
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
