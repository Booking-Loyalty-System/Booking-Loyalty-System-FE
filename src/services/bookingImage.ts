import { apiClient } from "@/core/api/apiClient";
import { ENDPOINTS } from "@/core/api/endpoints";

export type BookingImageType = "BeforeWash" | "AfterWash";

export async function uploadBookingImage(
  file: File,
  bookingId: string,
  type: BookingImageType,
  note?: string,
  token?: string, // không còn dùng trực tiếp — apiClient tự gắn token qua interceptor
): Promise<{ imageUrl: string }> {
  // Thông tin lấy từ tài khoản Cloudinary của bạn
  const CLOUD_NAME = "dtyfp1tg2";
  const UPLOAD_PRESET = "dtyfp1tg2"; // Trùng tên với Cloud Name theo cài đặt của bạn

  const formData = new FormData();
  // Bắt buộc phải là "file" và "upload_preset" theo chuẩn của Cloudinary
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // (Tùy chọn) Nhét ảnh vào folder riêng để dễ quản lý trên Cloudinary
  formData.append("folder", `AutoWash/Bookings/${bookingId}/${type}`);

  // BƯỚC 1: Upload file thật lên Cloudinary để lấy URL public
  let imageUrl: string;
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Tải ảnh lên Cloudinary thất bại",
      );
    }

    // Cloudinary trả về link ảnh an toàn (HTTPS) ở trường 'secure_url'
    imageUrl = data.secure_url;
  } catch (error: any) {
    throw new Error(error.message || "Lỗi kết nối đến máy chủ Cloudinary");
  }

  // BƯỚC 2: Lưu imageUrl vừa có vào backend, gắn với bookingId
  // Đây là bước trước đây bị THIẾU — Cloudinary có ảnh nhưng BE không hề biết booking
  // này đã có ảnh, nên GET /api/bookings/{id}/images luôn trả về mảng rỗng.
  try {
    await apiClient.post(ENDPOINTS.BOOKING.IMAGES(bookingId), {
      imageUrl,
      type,
      note: note ?? null,
    });
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        "Ảnh đã upload lên Cloudinary nhưng lưu vào hệ thống thất bại.",
    );
  }

  return { imageUrl };
}