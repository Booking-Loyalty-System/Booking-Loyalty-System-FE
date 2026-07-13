export type BookingImageType = "BeforeWash" | "AfterWash";

export async function uploadBookingImage(
  file: File,
  bookingId: string,
  type: BookingImageType,
  note?: string,
  token?: string
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

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Cloudinary trả về link ảnh an toàn (HTTPS) ở trường 'secure_url'
      return { imageUrl: data.secure_url };
    } else {
      throw new Error(data.error?.message || "Tải ảnh lên Cloudinary thất bại");
    }
  } catch (error: any) {
    throw new Error(error.message || "Lỗi kết nối đến máy chủ Cloudinary");
  }
}