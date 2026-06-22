import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { BookingRepositoryImplement } from '../infrastructure/repositories/booking/booking.repository.implement.ts';
import { BookingRepositoryMock } from '../infrastructure/repositories/booking/booking.repository.mock.ts';
import type {CreateBookingInput, MyBookingRecord} from '../domain/models/booking/booking.model.ts';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const bookingRepository = useMock
    ? new BookingRepositoryMock()
    : new BookingRepositoryImplement();

export const useBooking = () => {
    const queryClient = useQueryClient();

    const myBookingsQuery = useQuery<MyBookingRecord[]>({
        queryKey: ['my_bookings'],
        queryFn: () => bookingRepository.getMyBookings(),
        // staleTime: Có thể đặt thời gian cache ở đây nếu muốn, ví dụ 1 phút: 60 * 1000
    });

    // Sử dụng useMutation cho việc tạo mới Booking
    const createBookingMutation = useMutation({
        mutationFn: (bookingData: CreateBookingInput) =>
            bookingRepository.createBooking(bookingData),
        onSuccess: (data) => {
            console.log("Đặt lịch thành công:", data);

            // Xóa cache cũ, buộc React Query phải gọi lại api getMyBookings
            // để bảng lịch sử có dữ liệu mới nhất
            queryClient.invalidateQueries({ queryKey: ['my_bookings'] });
        },
        onError: (error) => {
            console.error("Lỗi khi tạo booking:", error);
        }
    });

    const cancelBookingMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            bookingRepository.cancelBooking(id, reason),
        onSuccess: () => {
            // Tự động reload lại danh sách lịch sử bốc lịch
            queryClient.invalidateQueries({ queryKey: ['my_bookings'] });
        },
        onError: (error) => {
            console.error("Lỗi khi hủy đặt lịch:", error);
        }
    });

    return {
        myBookings: myBookingsQuery.data || [],
        isLoading: myBookingsQuery.isLoading,
        isFetchingBookings: myBookingsQuery.isLoading,
        isBooking: createBookingMutation.isPending,
        error: createBookingMutation.error,
        createBooking: createBookingMutation.mutateAsync,
        cancelBooking: cancelBookingMutation.mutateAsync,
        isCanceling: cancelBookingMutation.isPending
    };
};