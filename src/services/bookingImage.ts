import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
import axios from "axios";

export type BookingImageType = "BeforeWash" | "AfterWash";

export interface BookingImage {
  id: string;
  imageUrl: string;
  type: BookingImageType;
  note?: string | null;
  createdAt: string;
}

const API = import.meta.env.VITE_API_BASE_URL;

/** Đẩy file lên Firebase Storage, trả về download URL (https). */
export async function uploadToFirebase(
  file: File,
  bookingId: string,
  type: BookingImageType,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `booking-images/${bookingId}/${type}-${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

/** Lưu URL ảnh vào booking. token = JWT đăng nhập app (role Staff). */
export async function addBookingImage(
  bookingId: string,
  imageUrl: string,
  type: BookingImageType,
  note: string | undefined,
  token: string,
): Promise<BookingImage> {
  const res = await axios.post(
    `${API}/bookings/${bookingId}/images`,
    { imageUrl, type, note },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
}

/** Tiện ích: upload + lưu trong 1 lần gọi. */
export async function uploadBookingImage(
  file: File,
  bookingId: string,
  type: BookingImageType,
  note: string | undefined,
  token: string,
) {
  const url = await uploadToFirebase(file, bookingId, type);
  return addBookingImage(bookingId, url, type, note, token);
}
