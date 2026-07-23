import { apiClient } from "@/core/api/apiClient";
import { ENDPOINTS } from "@/core/api/endpoints";

export type BookingImageType = "BeforeWash" | "AfterWash";

// SỬA: Thay đổi kiểu trả về, yêu cầu trả về thêm id
export async function uploadBookingImage(
  file: File,
  bookingId: string,
  type: BookingImageType,
  note?: string
): Promise<{ id: string; imageUrl: string }> {
  
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `AutoWash/Bookings/${bookingId}/${type}`);

  let imageUrl: string;
  
  // 1. Upload ảnh lên Cloudinary
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

  // 2. Lưu thông tin ảnh vào Backend
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

  // 3. XỬ LÝ FE: Gọi lại API GET để lấy ID của bức ảnh vừa lưu
  try {
    const getResponse = await apiClient.get(ENDPOINTS.BOOKING.IMAGES(bookingId));
    
    // Xử lý linh hoạt cấu trúc trả về của API GET (dạng mảng trực tiếp hoặc bọc trong object data)
    const allImages: any[] = Array.isArray(getResponse.data) 
      ? getResponse.data 
      : Array.isArray(getResponse.data?.data)
        ? getResponse.data.data
        : Array.isArray(getResponse.data?.items)
          ? getResponse.data.items
          : [];

    // Tìm ảnh khớp với URL vừa upload
    const uploadedImage = allImages.find(
      (img: any) => img.imageUrl === imageUrl || img.url === imageUrl || img.imagePath === imageUrl
    );
    
    // Lấy ID (tùy vào tên field backend trả về là id hay imageId)
    const imageId = uploadedImage?.id || uploadedImage?.imageId || "";

    return { id: imageId, imageUrl };
  } catch (error) {
    console.error("Lỗi khi lấy ID ảnh từ Backend:", error);
    // Fallback trả về ID rỗng nếu lỗi GET, lúc này ảnh vẫn hiện nhưng bấm xóa sẽ không được
    return { id: "", imageUrl };
  }
}

// 4. API XÓA ẢNH
export const deleteBookingImage = async (bookingId: string, imageId: string) => {
  const response = await apiClient.delete(`/bookings/${bookingId}/images/${imageId}`);
  return response.data;
};