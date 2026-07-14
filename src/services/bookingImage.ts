import { apiClient } from "@/core/api/apiClient";
import { ENDPOINTS } from "@/core/api/endpoints";

export type BookingImageType = "BeforeWash" | "AfterWash";

export async function uploadBookingImage(
  file: File,
  bookingId: string,
  type: BookingImageType,
  note?: string
): Promise<{ imageUrl: string }> {
  
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `AutoWash/Bookings/${bookingId}/${type}`);

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

    imageUrl = data.secure_url;
  } catch (error: any) {
    throw new Error(error.message || "Lỗi kết nối đến máy chủ Cloudinary");
  }

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